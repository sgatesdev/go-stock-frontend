import { Link } from "react-router-dom";

function Nav() {
	return(
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
		<span className="navbar-brand">Go Stock</span>
		<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
		<span className="navbar-toggler-icon"></span>
		</button>
		<div className="collapse navbar-collapse" id="navbarText">
		<ul className="navbar-nav mr-auto">
			<li className="nav-item active">
			<Link to="/" className="nav-link">Dashboard</Link>
			</li>
			<li className="nav-item">
			<Link to="/stocks" className="nav-link">Stocks</Link>
			</li>
			<li className="nav-item">
			<Link to="/analysis" className="nav-link">Analysis</Link>
			</li>
		</ul>
		</div>
		</nav>
	);
}

export default Nav;