import React from 'react';
import { useState, useEffect } from 'react';
import { Jumbotron } from "react-bootstrap";

const useFetch = () => {
    const [news, setNews] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const key = "bb279f1560c14af2b31fb0c75c8e4187"
    const today = new Date();
    const curDate = formatDate(today);
    const prevDate = formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
    const url = "https://newsapi.org/v2/everything?q=covid19&language=en&from=" + prevDate + "&to=" + curDate + "&sortBy=popularity&apiKey=" + key;

    function formatDate(input) {
        let date = input.getFullYear() + '-' + (input.getMonth() + 1) + '-' + input.getDate();
        return date;
    }

    useEffect(async () => {
        const response = await fetch(url, {
            "method": "GET",
        });
        const data = await response.json();
        setNews(data);
        setLoading(false);
    }, []);

    return { news, isLoading };
};

const News = () => {
    const { news, isLoading } = useFetch();
    return (
        <>
            {isLoading ? <div>Loading...</div> :
                <Jumbotron fluid style={{ background: "#20475A" }}>
                    <p>News Page!</p>
                    <p>{news.articles[0].author}</p>
                </Jumbotron>
            }
        </>
    );
}

export default News;