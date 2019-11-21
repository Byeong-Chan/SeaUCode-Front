import React, { useEffect, useState } from 'react';
import 'typescript';
import {Carousel} from 'react-bootstrap';

function IndexPage() {

    //const [isLogedIn, toggleLogedIn] = useState(false);

    return (
        <div>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://cdn2.slidemodel.com/wp-content/uploads/FF0215-01-free-web-developer-icons-for-powerpoint-16x9-1.jpg"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://cdn2.slidemodel.com/wp-content/uploads/FF0215-01-free-web-developer-icons-for-powerpoint-16x9-1.jpg"
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default IndexPage;