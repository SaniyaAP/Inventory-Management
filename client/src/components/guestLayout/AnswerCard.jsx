// src/components/AnswerCard.js
import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AiOutlineLike, AiOutlineDislike, AiOutlineComment } from 'react-icons/ai';

const AnswerCard = ({ answer, index, technologyName, errorTypeName, likes, unlikes, comments, commentInputsVisible, onLike, onUnlike, onToggleCommentInput, onCommentChange, onAddComment, onVideoClick, userData }) => {
    return (
        <Col key={index} xs={12} className="mb-4">
            <Card style={{ width: '100%' }}>
                <Card.Body style={{ textAlign: 'left' }}>
                    <Card.Title>
                        <Row>
                            <Col xs={3}>Technology :</Col>
                            <Col xs={9}>{technologyName}</Col>
                        </Row>
                    </Card.Title>

                    <Card.Subtitle className="mb-2 text-muted">
                        <Row>
                            <Col xs={3}>Error Type :</Col>
                            <Col xs={9}>{errorTypeName}</Col>
                        </Row>
                    </Card.Subtitle>

                    <Card.Subtitle>
                        <Row>
                            <Col xs={3}>Description :</Col>
                            <Col xs={9}>{answer.description}</Col>
                        </Row>
                    </Card.Subtitle>

                    <Row>
                        <Col xs={2}>
                            <Button variant="primary" onClick={() => onVideoClick(answer)}>
                                Play Video
                            </Button>
                        </Col>
                        <Col xs={1}>
                            <a href={answer.links} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-primary">Link</Button>
                            </a>
                        </Col>
                    </Row>

                    {userData?._id && (
                        <Row className="mt-3">
                            <Col xs={2}>
                                <Button variant="link" onClick={() => onLike(index)}>
                                    <AiOutlineLike /> {likes[index] || 0}
                                </Button>
                            </Col>
                            <Col xs={2}>
                                <Button variant="link" onClick={() => onUnlike(index)}>
                                    <AiOutlineDislike /> {unlikes[index] || 0}
                                </Button>
                            </Col>
                            <Col xs={2}>
                                {commentInputsVisible[index] ? (
                                    <>
                                        <Form.Control
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={comments[index] || ''}
                                            onChange={(e) => onCommentChange(index, e.target.value)}
                                        />
                                        <Button
                                            variant="primary"
                                            onClick={() => onAddComment(index)}
                                        >
                                            Add Comment
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="link" onClick={() => onToggleCommentInput(index)}>
                                        <AiOutlineComment /> {comments[index]?.length || 0}
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default AnswerCard;
