import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ContentLoader, { Facebook, BulletList } from 'react-content-loader';

const MyFacebookLoader = () => <Facebook />

const MyBulletListLoader = () => <BulletList />

const MyLoader = () => (
  <ContentLoader height={90} speed={1} primaryColor={'#f3f3f3'} secondaryColor={'#ecebeb'}>
    {/* Pure SVG */}
    <circle cx="30" cy="30" r="30" />
    <rect x="80" y="5" rx="4" ry="4" width="300" height="10" />
    <rect x="80" y="25" rx="3" ry="3" width="300" height="13" />
    <rect x="80" y="45" rx="3" ry="3" width="260" height="10" />
  </ContentLoader>
)

const Loading = () => (
    <div>
        <MyLoader />
        <MyFacebookLoader />
        <MyBulletListLoader />
        <MyBulletListLoader />
        <MyBulletListLoader />
    </div>
)

const showSekeleton = () => {
    // create loading dom and append to root
    const loading = document.createElement('div');
    loading.setAttribute('id', 'loading');
    const root = document.getElementById('root');
    root.appendChild(loading);
    const ele = <Loading />;
    ReactDOM.render(ele, document.getElementById('loading'));
}


const hideSekeleton = () => {
    const root = document.getElementById('root');
    const loading = document.getElementById('loading');
    if (loading) {
        root.removeChild(loading);
    }
}

export {showSekeleton, hideSekeleton}
