const { Expense, User, Tag } = require('../../database/models')
const { NotFoundError } = require('../../utils/errors/userfacing')

exports.expenseResolvers = {
  Query: {
    getExpenses: async (_, args) => {
      if (!args.id) {
        const { skip, limit, month, year } = args
        const query = {}
        if (month || year) {
          // (month, !year) => select current year,
          // (!month, year) => select that month this year
          // (month, year) => select that month, that year
          const dateStart = new Date(
            year || new Date().getFullYear(),
            month - 1 || 0
          )
          const dateEnd = new Date(dateStart)
          if (month) dateEnd.setMonth(dateStart.getMonth() + 1)
          else dateEnd.setFullYear(dateStart.getFullYear() + 1)

          query['date'] = {
            [Op.gt]: dateStart,
            [Op.lt]: dateEnd
          }
        }
        return await Expense.findAll({
          where: query,
          limit: limit || 50,
          offset: skip || 0,
          order: [['date', 'DESC']],
          rejectOnEmpty: new NotFoundError('Expense not found')
        })
      }
      return [
        await Expense.findByPk(args.id, {
          rejectOnEmpty: new NotFoundError('Expense not found')
        })
      ]
    }
  },
  Mutation: {
    createExpenses: async (_, args) => {
      const expensePromises = args.input.map(async (data) => {
        let payee = await User.findByPk(data.payee.id, {
          rejectOnEmpty: new NotFoundError('User id not found')
        })

        let newExpense = await Expense.create(
          {
            title: data.title,
            price: data.price,
            description: data.description,
            date: data.date,
            resolved: data.resolved
          },
          {
            // TODO: update this to only include below and get fields directly from object
            // fields: ['title', 'description', 'price', 'date', 'resolved']
          }
        )

        // Tag instances may or may not exist
        let tagPromises = data.tags.map((tag) => {
          return Tag.findOrCreate({
            where: {
              name: tag
            }
          })
        })
        let tags = await Promise.all(tagPromises)
        //tag[0] is the object, tag[1] is boolean, see findOrCreate
        tags = tags.map((tag) => tag[0])
        await newExpense.addTags(tags)
        await payee.addExpense(newExpense)
        await newExpense.reload()
        // Transform to object
        newExpense = newExpense.toJSON()
        // Remap tag objects to strings
        newExpense.tags = newExpense.tags.map((tag) => tag.name)
        return newExpense
      })

      const newExpenses = await Promise.all(expensePromises)
      return newExpenses
    },
    deleteExpense: async (_, args) => {
      return await await Expense.destroy(
        {
          where: {
            id: args.id
          }
        },
        {
          rejectOnEmpty: new NotFoundError('Expense not found')
        }
      )
    },
    updateExpense: async (_, args) => {
      const expenseToUpdate = await Expense.findByPk(args.input?.id, {
        rejectOnEmpty: new NotFoundError('Expense not found')
      })
      // Check if we need to change the payee
      console.log(expenseToUpdate)
      const payee = await User.findByPk(args.input?.payee.id, {
        rejectOnEmpty: new NotFoundError('Payee id not found')
      })
      payee.addExpense(expenseToUpdate)

      const tagPromises = args.input?.tags.map((tag) => {
        return Tag.findOrCreate({
          where: {
            name: tag
          }
        })
      })
      let tags = await Promise.all(tagPromises)
      //tag[0] is the object, tag[1] is boolean, see findOrCreate
      tags = tags.map((tag) => tag[0])
      await expenseToUpdate.setTags(tags)

      await expenseToUpdate.update(args.input, {
        fields: ['title', 'description', 'price', 'date', 'resolved']
      })

      await expenseToUpdate.save()
      await expenseToUpdate.reload()
      return expenseToUpdate
    }
  }
}
