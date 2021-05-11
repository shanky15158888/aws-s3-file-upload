import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import S3UploadTypeSelection from './S3UploadTypeSelection';

function App() {
  return (
    <div className="App">
        <h2>File Upload to S3</h2>
        <hr/>
        <S3UploadTypeSelection/>
    </div>
  );
}

export default App;
