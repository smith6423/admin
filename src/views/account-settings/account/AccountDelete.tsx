// MUI Imports
import { useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

const AccountDelete = () => {
  const [checked, setChecked] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    // 실제 탈퇴 API 연동 또는 처리 로직
    alert('계정이 탈퇴되었습니다.')
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader title='Delete Account' />
      <CardContent className='flex flex-col items-start gap-6'>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />}
          label='I confirm my account deactivation'
        />
        <Button variant='contained' color='error' type='button' disabled={!checked} onClick={() => setOpen(true)}>
          Deactivate Account
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>정말로 계정을 탈퇴하시겠습니까?</DialogTitle>
          <DialogContent>탈퇴 후에는 계정 복구가 불가합니다.</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleDelete} color='error'>
              탈퇴
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default AccountDelete
