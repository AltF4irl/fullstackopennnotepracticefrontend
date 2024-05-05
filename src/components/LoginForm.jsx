const LoginForm = ({
    loginHandler,
    usernameChangeHandler,
    passwordChnageHandler,
    username,
    password
   }) => {
   return (
     <div>
       <h2>Login</h2>
 
       <form onSubmit={loginHandler}>
         <div>
           username
           <input
             value={username}
             onChange={usernameChangeHandler}
           />
         </div>
         <div>
           password
           <input
             type="password"
             value={password}
             onChange={passwordChnageHandler}
           />
       </div>
         <button type="submit">login</button>
       </form>
     </div>
   )
 }
 
 export default LoginForm