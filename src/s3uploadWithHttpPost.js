import React from 'react'
import { SECRET_KEY, BUCKET_NAME, ACCESS_KEY, BUCKET_REGION } from './awsCredential'
var crypto = require("crypto-js");

function getSignatureKey(key, dateStamp, regionName, serviceName) {
    var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = crypto.HmacSHA256(regionName, kDate);
    var kService = crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

const stringToSign = "{ \"expiration\": \"2024-12-30T12:00:00.000Z\",\r\n" + "  \"conditions\": [\r\n"
    + "    {\"bucket\": \"" + BUCKET_NAME + "\"},\r\n"
    + "    [\"starts-with\", \"$key\", \"\"],\r\n" + "    {\"acl\": \"private\"},\r\n"
    + "    {\"success_action_redirect\": \"http://" + BUCKET_NAME + ".s3.amazonaws.com/successful_upload.html\"},\r\n"
    + "    [\"starts-with\", \"$Content-Type\", \"\"],\r\n"
    + "    {\"x-amz-meta-uuid\": \"14365123651274\"},\r\n"
    + "    {\"x-amz-server-side-encryption\": \"AES256\"},\r\n"
    + "    [\"starts-with\", \"$x-amz-meta-tag\", \"\"],\r\n" + "\r\n"
    + "    {\"x-amz-credential\": \"" + ACCESS_KEY + "/20201021/" + BUCKET_REGION + "/s3/aws4_request\"},\r\n"
    + "    {\"x-amz-algorithm\": \"AWS4-HMAC-SHA256\"},\r\n"
    + "    {\"x-amz-date\": \"20201021T041356Z\" }\r\n" + "  ]\r\n" + "}";

class S3UploadWithHttpPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            fileType: '',
            fileName: '',
            string_to_sign: '',
            signature: ''
        }
        this.myRef = React.createRef();
    }

    componentDidMount() {
        const string_to_sign = btoa(stringToSign);
        const signatureKey = getSignatureKey(SECRET_KEY, "20201021", BUCKET_REGION, "s3");
        const signature = crypto.HmacSHA256(string_to_sign, signatureKey).toString()
        this.setState({ string_to_sign, signature })
    }

    handleChange = e => {
        const file = e.target.files[0];
        this.setState({ file, fileType: file.type, fileName: file.name })
    }

    render() {
        const { fileType, fileName, signature, string_to_sign } = this.state;
        return (
            <div>
                <div style={{ "margin-bottom": "0px" }}><b>S3 Upload via HTTP POST</b></div>
                <form action={`http://${BUCKET_NAME}.s3.amazonaws.com`} method="post" enctype="multipart/form-data">
                    {/* Key to upload: */}
                    <input type="hidden" name="key" value={fileName} /><br />
                    <input type="hidden" name="acl" value="private" />
                    <input type="hidden" name="success_action_redirect" value={`http://${BUCKET_NAME}.s3.amazonaws.com/successful_upload.html`} />
                    {/* Content-Type: */}
                    <input type="hidden" name="Content-Type" value={fileType} /><br />
                    <input type="hidden" name="x-amz-meta-uuid" value="14365123651274" />
                    <input type="hidden" name="x-amz-server-side-encryption" value="AES256" />
                    <input type="hidden" name="X-Amz-Credential" value={`${ACCESS_KEY}/20201021/${BUCKET_REGION}/s3/aws4_request`} />
                    <input type="hidden" name="X-Amz-Algorithm" value="AWS4-HMAC-SHA256" />
                    <input type="hidden" name="X-Amz-Date" value="20201021T041356Z" />
                    {/* Tags for File: */}
                    <input type="hidden" name="x-amz-meta-tag" value="" /><br />
                    <input type="hidden" name="Policy" value={string_to_sign} />
                    <input type="hidden" name="X-Amz-Signature" value={signature} />
                    {/* File: */}
                    <input type="file" name="file" ref={this.myRef} style={{ display: 'none' }} onChange={(e) => this.handleChange(e)} />
                    <button type="button" className="btn" onClick={() => this.myRef.current.click()}>Select File</button>
                    {/* The elements after this will be ignored */}
                    <input type="submit" name="submit" value="Upload" className="btn" />
                    <div>{fileName}</div>
                </form>
                <hr />
            </div>
        )
    }
}

export default S3UploadWithHttpPost;