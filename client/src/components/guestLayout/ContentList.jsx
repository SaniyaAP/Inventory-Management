import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Form, Modal } from 'react-bootstrap';
import { AiOutlineLike, AiOutlineDislike, AiOutlineComment } from 'react-icons/ai';
import { postInteraction, getAllInteractions } from '../../utils/api'; // Ensure getAllInteractions is implemented
import { useUserData } from '../../utils/Cookies';

const ContentList = ({ title, items, buttonText }) => {
    const { user: userData } = useUserData();
    const [likes, setLikes] = useState({});
    const [unlikes, setUnlikes] = useState({});
    const [currentComments, setCurrentComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [documentPath, setDocumentPath] = useState('');

    // Fetch interactions data
    const fetchInteractions = async () => {
        try {
            const response = await getAllInteractions();
            if (response.ok) {
                const data = await response.json();
                const likesMap = {};
                const unlikesMap = {};
                const commentsMap = {};

                data.forEach(interaction => {
                    if (interaction.liked) {
                        likesMap[interaction.answer_id] = (likesMap[interaction.answer_id] || 0) + 1;
                    }
                    if (interaction.unliked) {
                        unlikesMap[interaction.answer_id] = (unlikesMap[interaction.answer_id] || 0) + 1;
                    }
                    if (interaction.comments && Array.isArray(interaction.comments)) {
                        commentsMap[interaction.answer_id] = (commentsMap[interaction.answer_id] || []).concat(interaction.comments);
                    }
                });

                setLikes(likesMap);
                setUnlikes(unlikesMap);
                setCurrentComments(commentsMap);
            } else {
                console.error('Error fetching interactions:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching interactions:', error);
        }
    };

    // Polling mechanism
    useEffect(() => {
        fetchInteractions(); // Initial fetch
        const interval = setInterval(fetchInteractions, 3000); // Fetch every 3 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const handleLike = async (itemId) => {
        const response = await postInteraction({ user_id: userData._id, answer_id: itemId, liked: true });
        if (response.ok) {
            setLikes(prevLikes => ({
                ...prevLikes,
                [itemId]: (prevLikes[itemId] || 0) + 1
            }));
        } else {
            console.error('Error posting like:', await response.text());
        }
    };

    const handleDislike = async (itemId) => {
        const response = await postInteraction({ user_id: userData._id, answer_id: itemId, unliked: true });
        if (response.ok) {
            setUnlikes(prevUnlikes => ({
                ...prevUnlikes,
                [itemId]: (prevUnlikes[itemId] || 0) + 1
            }));
        } else {
            console.error('Error posting dislike:', await response.text());
        }
    };

    const handleComment = async () => {
        if (selectedItemId && newComment.trim()) {
            const response = await postInteraction({ user_id: userData._id, answer_id: selectedItemId, comment: newComment });
            if (response.ok) {
                setCurrentComments(prevComments => {
                    const updatedComments = { ...prevComments };
                    if (!Array.isArray(updatedComments[selectedItemId])) {
                        updatedComments[selectedItemId] = [];
                    }
                    updatedComments[selectedItemId] = [...updatedComments[selectedItemId], newComment];
                    return updatedComments;
                });
                setNewComment('');
                setShowCommentsModal(false);
            } else {
                console.error('Error posting comment:', await response.text());
            }
        }
    };

    const handleToggleCommentInput = (itemId) => {
        setSelectedItemId(itemId);
        setShowCommentsModal(true);
    };

    const handleView = (filePath) => {
        setDocumentPath(filePath);
        setShowViewModal(true);
    };

    const handleDownload = () => {
        const fileName = documentPath.split('/').pop();
        const link = document.createElement('a');
        link.href = `http://localhost:7000/api/download/${fileName}`; // Adjust URL as needed
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowViewModal(false); // Close the modal after download
    };

    return (
        <div>
            {items.length > 0 && (
                <Row>
                    <Col xs={12}>
                        <h2 className="mb-4">{title}</h2>
                    </Col>
                    {items.map((item, index) => (
                        <Col key={index} xs={12} sm={6} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Button variant="primary" href={item.link} target="_blank">
                                        {buttonText}
                                    </Button>
                                    {/* View Button */}
                                    {item.filePath && (
                                        <Button variant="info" onClick={() => handleView(item.filePath)}>
                                            View
                                        </Button>
                                    )}
                                    <Row className="mt-3">
                                        <Col xs={2}>
                                            <Button variant="" onClick={() => handleLike(item._id)}>
                                                <AiOutlineLike /> {likes[item._id] || 0}
                                            </Button>
                                        </Col>
                                        <Col xs={2}>
                                            <Button variant="" onClick={() => handleDislike(item._id)}>
                                                <AiOutlineDislike /> {unlikes[item._id] || 0}
                                            </Button>
                                        </Col>
                                        <Col xs={2}>
                                            <Button
                                                variant=""
                                                onClick={() => handleToggleCommentInput(item._id)}
                                            >
                                                <AiOutlineComment /> {currentComments[item._id]?.length || 0}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Comments Modal */}
            <Modal show={showCommentsModal} onHide={() => setShowCommentsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {(Array.isArray(currentComments[selectedItemId]) ? currentComments[selectedItemId] : []).map((comment, index) => (
                            <li key={index}>{comment}</li>
                        ))}
                    </ul>
                    <Form.Group controlId="newComment">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                            variant="primary"
                            className="mt-2"
                            onClick={handleComment}
                        >
                            Submit
                        </Button>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Document Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>View Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe
                        src={`http://localhost:7000/${documentPath}`} // Assuming this is a direct link to the document
                        style={{ width: '100%', height: '400px' }}
                        title="Document Viewer"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleDownload}>
                        Download
                    </Button>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContentList;