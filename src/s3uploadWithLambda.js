import React from 'react'
import axios from 'axios'
import { API_ENDPOINT } from './awsCredential'

class S3UploadWithLambda extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            selectedFile: '',
            fileName:''
        }
        this.file = ''
    }

    handleChange = (event) => {
        const file = event.target.files[0];
        this.setState({ selectedFile: file, fileName: file.name })
        let reader = new FileReader();
        reader.onload = (e) => {
          this.file = e.target.result
        }
        reader.readAsDataURL(file)
}

    handleUpload = async() => {
        const { selectedFile } = this.state;
        const endpoint_api = API_ENDPOINT+'?fileName='+selectedFile.name;
        
        let binary = atob(this.file.split(',')[1])
        let array = []
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        let blobData = new Blob([new Uint8Array(array)], {type: "multipart/form-data"})
        const response = await axios({
            method: 'GET',
            url: endpoint_api
        })
        const result = await fetch(response.data.uploadURL, {
            method: 'PUT',
            body: blobData
          })
        console.log('Result: ', result)

    }

    render() {
        const { fileName } = this.state;
        return <div>
            <div><b>S3 Upload With Lambda</b></div>
            <div>
                <input type="file" ref={this.myRef} style={{ display: 'none' }} onChange={(e) => this.handleChange(e)} />
                <button type="button" className="btn" onClick={() => this.myRef.current.click()}>Select File</button>
                <button type="button" className="btn" onClick={this.handleUpload}>Upload</button>
                <div>{fileName}</div>
            </div>
        </div>
    }
}

export default S3UploadWithLambda;