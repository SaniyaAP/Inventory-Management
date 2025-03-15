// src/components/VideoModal.js
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const VideoModal = ({ show, onClose, videoUrl }) => {
    const getYouTubeEmbedURL = (url) => {
        if (url) {
            const videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
            }
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return '';
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Play Video</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {videoUrl && (
                    <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                            className="embed-responsive-item"
                            src={getYouTubeEmbedURL(videoUrl)}
                            allowFullScreen
                            style={{ height: '380px', width: '100%' }}
                        ></iframe>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VideoModal;
