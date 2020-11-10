import React from 'react';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { Tab, Icon, Button } from 'semantic-ui-react'
import HomeTab from '../../tabs/Home';
import AddTab from '../../tabs/AddFile';
import FetchTab from '../../tabs/FetchFile';
import MessageTab from '../../tabs/MessageTab';
import UpdateTab from '../../tabs/UpdatePost';

const Index = () => {
    const handleLogOut = () => {
        localStorage.clear();
        Router.replace('/user/login');
    }


    const panes = [
        {
          menuItem : <Button icon><Icon name='home' /> Home</Button>,
          render: () => <Tab.Pane key={1} attached={false}><HomeTab/></Tab.Pane>,
        },
        {
          menuItem: <Button icon><Icon name='hdd' /> Add File</Button>,
          render: () => <Tab.Pane key={2} attached={false}><AddTab /></Tab.Pane>,
        },
        {
          menuItem: <Button icon><Icon name='list' /> View File</Button>,
          render: () => <Tab.Pane key={3} attached={false}><FetchTab/></Tab.Pane>,
        },
        {
          menuItem: <Button icon><Icon name='inbox' /> View Messages</Button>,
          render: () => <Tab.Pane key={4} attached={false}><MessageTab /></Tab.Pane>,
        },
        {
          menuItem: <Button icon><Icon name='arrow alternate circle up' /> Update Post</Button>,
          render: () => <Tab.Pane key={5} attached={false}><UpdateTab /></Tab.Pane>,
        },
        {
            menuItem: <Button icon onClick={handleLogOut}><Icon name='log out' /> Log Out</Button>,
            render: () => null,
        },
        
    ]


    useEffect(() => {
       const token = localStorage.getItem('token');
       if(!token) Router.replace('/user/login');

    })
    

    return (
        
        <Tab menu={{ pointing: true }} panes={panes}/>
    )
};


export default Index;