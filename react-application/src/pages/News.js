import React from 'react';
import { useState, useEffect } from 'react';
import { Jumbotron, Image, Col } from "react-bootstrap";
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@material-ui/core';
import { Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch } from '@material-ui/core';

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
        setNews(data.articles);
        setLoading(false);
    }, []);

    return { news, isLoading };
};

const News = () => {
    const { news, isLoading } = useFetch();
    /** News Fields
     *  .author -> Article Author
     *  .content -> Full article body
     *  .description -> Short article summary
     *  .source.name -> Source
     *  .title -> Title
     *  .url -> Article url
     *  .urlToImage -> Article Image
     */
    return (
        <>
            {isLoading ? <div>Loading...</div> :
                <Paper>
                    <Jumbotron fluid style={{ background: "#20475A" }}>
                        <p>News Page!</p>
                        <p>{news[0].author}</p>
                    </Jumbotron>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                {news.map((article) => {
                                    return (
                                        <TableRow>
                                            <TableCell><Image src={article.urlToImage} thumbnail /></TableCell>
                                            <TableCell>{article.title}</TableCell>
                                            <TableCell>{article.author}</TableCell>
                                            <TableCell>{article.description}</TableCell>
                                        </TableRow>
                                    )

                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            }
        </>
    );
}

export default News;