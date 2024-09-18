
const EmailTemplate = ({username , otpCode}:{username : string ; otpCode:string}) => {
  return (
    <h1>Hellow dear {username} your OTP code is {otpCode} </h1>
  )
}

export default EmailTemplate
