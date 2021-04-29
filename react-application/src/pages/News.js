import React from 'react';
import { useState, useEffect } from 'react';
import { Badge, Col, Container, Jumbotron, Media, Row } from "react-bootstrap";

// Custom useFetch hook to call APIs needed for new page
const useFetch = () => {
    const [news, setNews] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const key = "bb279f1560c14af2b31fb0c75c8e4187"
    const today = new Date();
    const curDate = formatDate(today);
    const prevDate = formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
    const url = "https://newsapi.org/v2/everything?q=covid19&language=en&from=" + prevDate + "&to=" + curDate + "&sortBy=popularity&apiKey=" + key;

    // Date formatting for API call
    function formatDate(input) {
        let date = input.getFullYear() + '-' + (input.getMonth() + 1) + '-' + input.getDate();
        return date;
    }

    // Duplication removal algorithm to solve article duplication bug
    function filterArticles(articles) {
        const seen = new Set();
        const filtered = articles.filter(article => {
            const duplicate = seen.has(article.title);
            seen.add(article.title);
            return !duplicate;
        })
        return filtered;
    }

    // On page render, calls API to retrieve news data
    // On security issues with this call therefore it's safe to call it in the front end
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(url, {
                "method": "GET",
            });
            const data = await response.json();
            setNews(filterArticles(data.articles));
            setLoading(false);
        }
        fetchData();
    }, []);

    return { news, isLoading };
};

const News = () => {
    const { news, isLoading } = useFetch();

    // On click, opens news article in new page
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    // On mouse hover, changes link color to #0078ff and underlines 
    const onMouseOver = event => {
        const el = event.target;
        el.style.color = "#0078ff";
        el.style.cursor = "pointer";
        el.style.textDecoration = "underline"
    };

    // On mouse leave, changes link color back to white and removes underline
    const onMouseOut = event => {
        const el = event.target;
        el.style.color = "white";
        el.style.textDecoration = "none"
    };

    return (
        <>
            {isLoading ? <div>Loading...</div> :
                <>
                    <Jumbotron fluid style={{ background: "#20475A" }}>
                        <Container>
                            <Media>
                                <img
                                    width={500}
                                    height={315}
                                    className="mr-3"
                                    src={news[0].urlToImage}
                                    alt="Loading Image"
                                />
                                <Media.Body>
                                    <span><Badge variant="info">{news[0].source.name}</Badge></span>
                                    <h2
                                        onMouseEnter={event => onMouseOver(event)}
                                        onMouseOut={event => onMouseOut(event)}
                                        onClick={() => openInNewTab(news[0].url)}
                                        style={{ color: "white", fontWeight: "bold" }}>
                                        {news[0].title}
                                    </h2>
                                    <p style={{ color: "white", fontSize: "95%" }}>{news[0].content.substring(0, 200)}</p>
                                    <p style={{ color: "silver" }}>{news[0].publishedAt.substring(0, 10)}</p>
                                </Media.Body>
                            </Media>
                        </Container>
                    </Jumbotron>
                    <Container>
                        <Row>
                            {news.slice(1, 6).map((article) => {

                                // On mouse hover, changes link color to #0078ff and underlines
                                const onMouseOver = event => {
                                    const el = event.target;
                                    el.style.color = "#0078ff";
                                    el.style.cursor = "pointer";
                                    el.style.textDecoration = "underline"
                                };

                                // On mouse leave, changes link color back to blue and removes underline
                                const onMouseOut = event => {
                                    const el = event.target;
                                    el.style.color = "blue";
                                    el.style.textDecoration = "none"
                                };

                                // The first 6 articles except the first article, display in singular row under jumbotron
                                return (
                                    <Col key={Math.random().toString(36).substr(2, 9)}>
                                        <Media>
                                            <Media.Body>
                                                <img
                                                    width={180}
                                                    height={100}
                                                    className="mr-3"
                                                    src={article.urlToImage}
                                                    alt="Loading Image..."
                                                />
                                                <p onMouseEnter={event => onMouseOver(event)}
                                                    onMouseOut={event => onMouseOut(event)}
                                                    onClick={() => openInNewTab(article.url)}
                                                    style={{ fontSize: "80%", width: "180px", color: "blue" }}>
                                                    {article.title.substring(0, 50) + "..."}
                                                </p>
                                            </Media.Body>
                                        </Media>
                                    </Col>
                                )
                            })}
                        </Row>
                        {news.slice(6).map((article) => {
                            // On mouse hover, changes link color to #0078ff
                            const onMouseOver = event => {
                                const el = event.target;
                                el.style.color = "#0078ff";
                                el.style.cursor = "pointer";
                            };

                            // On mouse leave, changes link color back to white
                            const onMouseOut = event => {
                                const el = event.target;
                                el.style.color = "#000000";
                            };

                            // For every article after the 7th article, display each article within its own row
                            return (
                                <Media key={Math.random().toString(36).substr(2, 9)} style={{ paddingTop: "25px", paddingBottom: "25px" }}>
                                    <img
                                        width={320}
                                        height={200}
                                        className="mr-3"
                                        src={article.urlToImage}
                                        alt="Loading Image..."
                                    />
                                    <Media.Body>
                                        <h6><Badge variant="info">{article.source.name}</Badge></h6>
                                        <h4
                                            onMouseEnter={event => onMouseOver(event)}
                                            onMouseOut={event => onMouseOut(event)}
                                            onClick={() => openInNewTab(article.url)}>
                                            {article.title}</h4>
                                        <p>{article.content.substring(0, 200)}</p>
                                        <p style={{ color: "silver" }}>{article.publishedAt.substring(0, 10)}</p>
                                    </Media.Body>
                                </Media>
                            );
                        })}
                    </Container>
                </>
            }
        </>
    );
}

export default News;