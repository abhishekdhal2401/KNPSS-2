import React, { useState, useEffect } from 'react';
import { Accordion, Icon, Statistic, Container, Header, Divider } from 'semantic-ui-react'



const MessageTab = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const [activeIndex, setIndex] = useState(-1);
    const [messages, setMessages] = useState([]);
    const [count, setCount] = useState(0);
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        
        const newIndex = activeIndex === index ? -1 : index

        setIndex(newIndex);
    }

    const getMessages = async () => {
        try {
            const response = await fetch('/api/fetchMessages', {
                method : 'get',
                headers : {
                    'Authorization' : 'Bearer ' + token
                }
            });

            const result = await response.json();

            if(result.error === false) {
                setMessages(result.messages);
                setCount(result.messages.length);
            } else {
                setMessages([]);
            }
        } catch(err) {

        }
    }

    useEffect(() => {
        Promise.resolve(getMessages());
    })

    return (
            <Container className="messageTab">
            <div style={{textAlign : 'center', marginBottom : 10}}>
            <Statistic >
                <Statistic.Value>{count}</Statistic.Value>
                <Statistic.Label>Messages</Statistic.Label>
            </Statistic>
            </div>
            <Accordion fluid  styled exclusive={false}>
                {messages.length === 0 ? <div>No Messages</div> : null}
                {messages.map((message, index) => {
                    return (
                        <div key={index}>
                            <Accordion.Title
                    active={activeIndex === index}
                    index={index}
                    onClick={handleClick}
                >
                    
          <div style={{display : 'flex', alignItems : 'center', justifyContent : 'space-between'}}>
                    <div>
                    <span style={{borderRight : '1px solid black', paddingRight : 5}}>{index + 1 + ". "}From {message.name}</span>
                        <span style={{ paddingLeft : 5}}>{message.message.substring(0,10) + '...'}</span>
                        
                    
                    </div>
                    <div style={{borderLeft : '1px solid black', paddingLeft : 5}}>
                        {new Date(message.date).toUTCString().substring(0,16)}
                    </div>
          </div>
        </Accordion.Title>
                <Accordion.Content active={activeIndex === index}>
                <Container fluid>
                    <Header as='h2'>Message from {message.name}</Header>  
                    <Header as='span'>Date : {new Date(message.date).toUTCString().substring(0, 26)}</Header>
                    <br></br>  
                    <Header as='span'>Email : {message.email}</Header> 
                    <Divider/>
                    <p>
                    {message.message}
                    </p>
      
                </Container>
                </Accordion.Content>
                        </div>
                    )
                })}

                
            </Accordion>
            </Container>
        
    )
};

export default MessageTab;