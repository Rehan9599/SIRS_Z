export default function Login() {
	return (
		<form className="form">
			<h2>Welcome back</h2>
			<label htmlFor="login-email">Email</label>
			<input id="login-email" type="email" placeholder="you@example.com" required />

			<label htmlFor="login-password">Password</label>
			<input id="login-password" type="password" placeholder="Enter password" required />

			<button type="submit">Login</button>
		</form>
	);
}
