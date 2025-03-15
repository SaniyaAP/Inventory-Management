import React, { useState } from 'react';

const FileUpload = ({ onFileUpload, acceptedFileTypes }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const { type, size } = selectedFile;

            // Check for accepted file types
            if (!acceptedFileTypes.includes(type)) {
                setError('Invalid file type. Only images and videos are allowed.');
                setFile(null); // Clear the file input
                return;
            }

            // Check for file size (10 MB limit)
            if (size > 150 * 1024 * 1024) {
                setError('File size exceeds 10 MB limit.');
                setFile(null); // Clear the file input
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:7000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                alert('File uploaded successfully!');
                onFileUpload(responseData.filePath); // Pass the file path back to the parent component
                setFile(null); // Reset file input
            } else {
                alert('Failed to upload file.');
                const errorData = await response.json();
                setError(errorData.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file.');
        }
    };

    return (
        <div>
            <input 
                type="file" 
                accept={acceptedFileTypes.join(',')} 
                onChange={handleFileChange} 
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleUpload} disabled={!file}>
                Upload File
            </button>
        </div>
    );
};

export default FileUpload;