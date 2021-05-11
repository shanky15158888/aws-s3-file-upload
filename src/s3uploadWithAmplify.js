import React from 'react'
import Amplify, { Auth, Storage } from 'aws-amplify';
import { IDENTITY_POOL_ID, BUCKET_NAME, BUCKET_REGION, AMAZON_COGNITO_REGION } from './awsCredential'

class S3UploadWithAmplify extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            fileUrl: '',
            file: '',
            fileName: ''
        }
    }

    handleChange = (e) => {
        const file = e.target.files[0];
        this.setState({ fileUrl: URL.createObjectURL(file), file, fileName: file.name })
    }

    handleUpload = () => {
        const { fileName, file } = this.state;
        Storage.put(fileName, file)
        .then(() => {
            console.log('successfully uploaded')
            this.setState({ fileUrl: '', file: '', fileName: '' })
        })
        .catch((err) => {
            console.log('error uploading file', err)
        })
    }

    componentDidMount() {
        Amplify.configure({
            Auth: {
                identityPoolId: IDENTITY_POOL_ID, //REQUIRED - Amazon Cognito Identity Pool ID
                region: AMAZON_COGNITO_REGION, // REQUIRED - Amazon Cognito Region
            },
            Storage: {
                AWSS3: {
                    bucket: BUCKET_NAME, //REQUIRED -  Amazon S3 bucket name
                    region: BUCKET_REGION, //OPTIONAL -  Amazon service region
                }
            }
        });
    }

    render() {
        console.log('state', this.state)
        const { fileName } = this.state;
        return (
            <div>
                <div><b>S3 Upload With Amazon Amplify</b></div>
                <input type="file" ref={this.myRef} style={{ display: 'none' }} onChange={(e) => this.handleChange(e)} />
                <button type="button" className="btn" onClick={() => this.myRef.current.click()}>Select File</button>
                <button type="button" className="btn" onClick={this.handleUpload}>Upload</button>
                <div>{fileName}</div>
            </div>
        )
    }
}

export default S3UploadWithAmplify;