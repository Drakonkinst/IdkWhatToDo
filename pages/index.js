import Head from 'next/head'
import styled from 'styled-components'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import PhotoCredit from "../components/PhotoCredit"

// General data-fetching function
const fetcher = url => fetch(url).then(r => r.json());

export default function Home() {
  const BORED_URL = `http://www.boredapi.com/api/activity/`;
  const [ activity, setActivity ] = useState(null);
  const [ wallpaper, setWallpaper ] = useState(null);
  const [ isLoading, setLoading ] = useState(false);
  
  // https://stackoverflow.com/questions/69000300
  const [ refresh, setRefresh ] = useState(false);
  const [ requestActivity, setRequestActivity ] = useState(true);
  const [ requestWallpaper, setRequestWallpaper ] = useState(true);
  const [ showActivity, setShowActivity ] = useState(false);
  
  const refreshData = () => setRefresh(!refresh);
  
  // This is double calling due to https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode/61897567#61897567
  useEffect(() => {
    setLoading(true);
    if(requestActivity) {
      setRequestActivity(false);
      fetch(BORED_URL)
        .then((res) => res.json())
        .then((data) => {
          setActivity(data);
        });
    }
    
    if(requestWallpaper) {
      setRequestWallpaper(false);
      fetch("api/unsplash")
        .then((res) => res.json())
        .then((data) => {
          if(!data.error) {
            console.log(data);
            console.log("WALLPAPER", data.urls.regular)
            setWallpaper(data);
          }
        })
    }
    setLoading(false);
  }, [refresh])
  
  if(isLoading) {
    return <p>Loading...</p>
  }
  
  const shouldShowActivity = showActivity && activity != null;

  return (
    <Wrapper style={{
      backgroundImage: wallpaper == null ? null : `url(${wallpaper.urls.regular})`
    }}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="TODO" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <MainWrapper>
        <Main>
          {shouldShowActivity ? <Headline>
            {activity.activity}
          </Headline> : <Headline>
            Bored? Let's find you something to do.
            </Headline>}
          <MainButtonList>
            {!showActivity && <MainButton onClick={() => {
              setShowActivity(!showActivity);
            }}>Help I'm Bored</MainButton>}
            {showActivity && <MainButton onClick={() => {
              setRequestActivity(true);
              refreshData();
            }}>Give Me Another</MainButton>}
            <MainButton>Be More Specific</MainButton>
          </MainButtonList>
        </Main>
      </MainWrapper>
      <Footer>
        <PhotoCredit data={wallpaper} onRefresh={() => {
          setRequestWallpaper(true);
          refreshData();
        }}>
        </PhotoCredit>
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
`;
const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 800px;
`;

const Headline = styled.h1`
  min-height: 75px;
`;

const MainButtonList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  li button {
    margin-left: auto;
    margin-right: auto;
    width: 200px;
  }
`;
function MainButton({children, onClick}) {
  return (
    <li><Button variant="contained" size="large" onClick={onClick}>{children}</Button></li>
  );
}

const Footer = styled.footer`
  position: absolute;
  bottom: 5px;
  left: 5px;
`;