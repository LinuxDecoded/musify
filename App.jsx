import Dashboard from "./src/components/Dashboard"
import Login from "./src/components/Login"

const code = new URLSearchParams(window.location.search).get("code")

const App = () => {  
      return code ? <Dashboard code={code}/> : <Login/>
}

export default App