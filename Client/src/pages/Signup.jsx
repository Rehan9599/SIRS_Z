export default function Signup() {
	return (
		<form className="form">
			<h2>Create account</h2>
			<label htmlFor="signup-name">Full Name</label>
			<input id="signup-name" type="text" placeholder="John Doe" required />

			<label htmlFor="signup-email">Email</label>
			<input id="signup-email" type="email" placeholder="you@example.com" required />

			<label htmlFor="signup-password">Password</label>
			<input id="signup-password" type="password" placeholder="Create password" required />

			<button type="submit">Signup</button>
		</form>
	);
}
k