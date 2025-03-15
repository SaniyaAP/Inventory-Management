// src/pages/CodeStack.js
import React, { useEffect, useState } from 'react';
import {
    getAllAnswers,
    getAllTechnologies,
    getAllErrorTypes,
    getBooksByTechnology,
    getBlogsByTechnology,
    getLinksByTechnology,
    getResearchPapersByTechnology,
    getVideosByTechnology,
} from '../../utils/api';
import { Container, Row, Col, Form } from 'react-bootstrap';
import TechnologySelect from './TechnologySelect';
import SearchBar from './SearchBar';
import AnswerCard from './AnswerCard';
import ContentList from './ContentList';
import VideoModal from './VideoModal';
import { useUserData } from '../../utils/Cookies';

const CodeStack = () => {
    const [answers, setAnswers] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [errorTypes, setErrorTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const [selectedErrorType, setSelectedErrorType] = useState('');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [likes, setLikes] = useState([]);
    const [unlikes, setUnlikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentInputsVisible, setCommentInputsVisible] = useState([]);
    const [books, setBooks] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [links, setLinks] = useState([]);
    const [researchPapers, setResearchPapers] = useState([]);
    const [videos, setVideos] = useState([]);

    const { user: userData } = useUserData();

    useEffect(() => {
        fetchData();
    }, [selectedTechnology, selectedErrorType]);

    const fetchData = async () => {
        try {
            const [answersResponse, technologiesResponse, errorTypesResponse] = await Promise.all([
                getAllAnswers(selectedTechnology, selectedErrorType),
                getAllTechnologies(),
                getAllErrorTypes()
            ]);

            if (answersResponse.ok && technologiesResponse.ok && errorTypesResponse.ok) {
                const answersData = await answersResponse.json();
                const technologiesData = await technologiesResponse.json();
                const errorTypesData = await errorTypesResponse.json();

                setAnswers(answersData);
                setTechnologies(technologiesData);
                setErrorTypes(errorTypesData);

                const initialLikes = Array(answersData.length).fill(0);
                const initialUnlikes = Array(answersData.length).fill(0);
                const initialComments = Array(answersData.length).fill([]);
                const initialCommentInputsVisible = Array(answersData.length).fill(false);

                setLikes(initialLikes);
                setUnlikes(initialUnlikes);
                setComments(initialComments);
                setCommentInputsVisible(initialCommentInputsVisible);

                await fetchAdditionalData(selectedTechnology);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchAdditionalData = async (selectedTechnology) => {
        try {
            const [booksResponse, blogsResponse, linksResponse, researchPapersResponse, videosResponse] = await Promise.all([
                getBooksByTechnology(selectedTechnology),
                getBlogsByTechnology(selectedTechnology),
                getLinksByTechnology(selectedTechnology),
                getResearchPapersByTechnology(selectedTechnology),
                getVideosByTechnology(selectedTechnology)
            ]);

            const booksData = await booksResponse.json();
            const blogsData = await blogsResponse.json();
            const linksData = await linksResponse.json();
            const rpData = await researchPapersResponse.json();
            const videoData = await videosResponse.json();

            if (booksData) setBooks(booksData);
            if (blogsData) setBlogs(blogsData);
            if (linksData) setLinks(linksData);
            if (rpData) setResearchPapers(rpData);
            if (videoData) setVideos(videoData);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    const getTechnologyName = (id) => {
        const tech = technologies.find(t => t._id === id);
        return tech ? tech.technology : 'Unknown';
    };

    const getErrorTypeName = (id) => {
        const errorType = errorTypes.find(e => e._id === id);
        return errorType ? errorType.errorType : 'Unknown';
    };

    const filteredAnswers = answers.filter((answer) => {
        const technologyName = getTechnologyName(answer.technology).toLowerCase();
        const errorTypeName = getErrorTypeName(answer.errorType).toLowerCase();
        const description = answer.description.toLowerCase();

        return (
            (technologyName.includes(searchQuery.toLowerCase()) ||
                errorTypeName.includes(searchQuery.toLowerCase()) ||
                description.includes(searchQuery.toLowerCase())) &&
            (selectedTechnology ? answer.technology === selectedTechnology : true) &&
            (selectedErrorType ? answer.errorType === selectedErrorType : true)
        );
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleTechnologyChange = async (e) => {
        setSelectedTechnology(e.target.value);
        await fetchAdditionalData(e.target.value);
    };

    const handleErrorTypeChange = (e) => {
        setSelectedErrorType(e.target.value);
    };

    const handleVideoClick = (answer) => {
        setSelectedAnswer(answer);
        setShowVideoModal(true);
    };

    const handleVideoModalClose = () => {
        setShowVideoModal(false);
        setSelectedAnswer(null);
    };

    const handleLike = (index) => {
        const updatedLikes = [...likes];
        updatedLikes[index] = (updatedLikes[index] || 0) + 1;
        setLikes(updatedLikes);
    };

    const handleUnlike = (index) => {
        const updatedUnlikes = [...unlikes];
        updatedUnlikes[index] = (updatedUnlikes[index] || 0) + 1;
        setUnlikes(updatedUnlikes);
    };

    const handleToggleCommentInput = (index) => {
        const updatedCommentInputsVisible = [...commentInputsVisible];
        updatedCommentInputsVisible[index] = !updatedCommentInputsVisible[index];
        setCommentInputsVisible(updatedCommentInputsVisible);
    };

    const handleCommentChange = (index, value) => {
        const updatedComments = [...comments];
        updatedComments[index] = value;
        setComments(updatedComments);
    };

    const handleAddComment = (index) => {
        const updatedComments = [...comments];
        updatedComments[index] = updatedComments[index] ? [...updatedComments[index], comments[index]] : [comments[index]];
        setComments(updatedComments);
        handleToggleCommentInput(index);
    };

    return (
        <div>
            <Container className='pt-4'>
                <Row>
                    <Col xs={2}>Technology</Col>
                    <Col xs={2}>
                        <TechnologySelect
                            technologies={technologies}
                            selectedTechnology={selectedTechnology}
                            onTechnologyChange={handleTechnologyChange}
                        />
                    </Col>
                    <Col>
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                        />
                    </Col>
                </Row>
            </Container>

            <Container>
                <div>
                    <Row>
                        {filteredAnswers.map((answer, index) => (
                            <AnswerCard
                                key={index}
                                answer={answer}
                                index={index}
                                technologyName={getTechnologyName(answer.technology)}
                                errorTypeName={getErrorTypeName(answer.errorType)}
                                likes={likes}
                                unlikes={unlikes}
                                comments={comments}
                                commentInputsVisible={commentInputsVisible}
                                onLike={handleLike}
                                onUnlike={handleUnlike}
                                onToggleCommentInput={handleToggleCommentInput}
                                onCommentChange={handleCommentChange}
                                onAddComment={handleAddComment}
                                onVideoClick={handleVideoClick}
                                userData={userData}
                            />
                        ))}
                    </Row>

                    <ContentList
                        title="Books"
                        items={books}
                        buttonText="Read more"
                    />

                    <ContentList
                        title="Blogs"
                        items={blogs}
                        buttonText="Read more"
                    />

                    <ContentList
                        title="Links"
                        items={links}
                        buttonText="Visit link"
                    />

                    <ContentList
                        title="Research Papers"
                        items={researchPapers}
                        buttonText="Read more"
                    />

                    <ContentList
                        title="Videos"
                        items={videos}
                        buttonText="Play Video"
                        onItemClick={handleVideoClick}
                    />
                </div>
            </Container>

            <VideoModal
                show={showVideoModal}
                onClose={handleVideoModalClose}
                videoUrl={selectedAnswer?.link}
            />
        </div>
    );
};

export default CodeStack;
