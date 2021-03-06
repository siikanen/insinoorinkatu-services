import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const DeleteDialog = ({ dialogOpen, handleClose, handleConfirmDelete }) => {
  return (
    <Dialog open={dialogOpen} onClose={handleClose}>
      <DialogTitle id="deleteDialog">
        Are you sure you want to delete this expense?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will permanently delete the expense!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmDelete} color="primary">
          Delete
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default DeleteDialog
