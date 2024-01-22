import { Auth } from 'aws-amplify';

async function handleSubmit(event) {
  event.preventDefault();
  //^^//console.log("Inside ChangePassword handleSubmit()...")

  let newState = { ...this.state }
  newState.attemptingChangePassword = true;
  await this.setState(newState);

  let errorPresent = this.ValidateChangePasswordFields();

  try {
    if(errorPresent === false) {
      const { username, currentPassword, password: newPassword } = this.state;

      const cognitoUser = await Auth.signIn(username, currentPassword);

      await Auth.completeNewPassword(
        cognitoUser,
        newPassword,
        {
          given_name: 'john'
        }
      )

      let newState = { ...this.state }
      newState.attemptingChangePassword = false;
      await this.setState(newState);

      this.props.history.push("/login");
    }
  } catch (error) {

    let e = null;
    !error.message ? e = { "message" : error } : e = error;
    this.setState({
      errors: {
        ...this.state.errors,
        cognito: e
      }
    })

    //^^//console.log("Error changing passwords. error:");
    //^^//console.log(e)
  }
}

export default handleSubmit;