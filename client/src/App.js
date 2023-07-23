import './App.css';
import EmailLeadsCollection from './components/EmailLeadsCollection';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p> Leave your email to join our mailing list  </p>
        <EmailLeadsCollection />
      </header>
    </div>
  );
}

export default App;
