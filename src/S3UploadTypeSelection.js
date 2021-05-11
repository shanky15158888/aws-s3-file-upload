import React, {useState}from 'react';
import S3UploadWithAmplify from './s3uploadWithAmplify';
import S3UploadWithHttpPost from './s3uploadWithHttpPost';
import S3UploadWithLambda from './s3uploadWithLambda';

function S3UploadTypeSelection() {
    const [s3UploadType, selectS3UploadType] = useState("usingLambda");
    const handleClick = (type) => {
        selectS3UploadType(type);
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-7">
                    { s3UploadType === "usingLambda" && <S3UploadWithLambda/> }
                    { s3UploadType === "usingPost" && <S3UploadWithHttpPost/> }
                    { s3UploadType === "usingAmplify" && <S3UploadWithAmplify/> }
                </div>
                <div className="col-md-5 btndiv">
                    <button type="button" className={`btn ${s3UploadType !== "usingLambda"? "btn-primary": "btn-secondary"}`} onClick={() => handleClick("usingLambda")}>Upload using Lambda</button>
                    <button type="button" className={`btn ${s3UploadType !== "usingPost"? "btn-primary": "btn-secondary"}`} onClick={() => handleClick("usingPost")}>Upload using HTTP Post</button>
                    <button type="button" className={`btn ${s3UploadType !== "usingAmplify"? "btn-primary": "btn-secondary"}`} onClick={() => handleClick("usingAmplify")}>Upload Using Amplify</button>
                </div>
            </div>
        </div>
    );
}

export default S3UploadTypeSelection;