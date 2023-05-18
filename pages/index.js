import Head from 'next/head'
import styled from 'styled-components'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import PhotoCredit from "../components/PhotoCredit";
import { motion, AnimatePresence } from "framer-motion"

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
  const [ showConfig, setShowConfig ] = useState(false);
  
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
        <title>Idk What To Do</title>
        <meta name="description" content="TODO" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <MainWrapper>
        <ActivityWrapper as={motion.main} animate={{
          height: "auto",
          paddingTop: showConfig ? "20px" : "50px",
          paddingBottom: showConfig ? "20px" : "50px"
        }}>
          <Activity>
            {shouldShowActivity ? <Headline>
              {activity.activity}
            </Headline> : <Headline>
              Bored? Let's find you something to do.
            </Headline>}
            <ActivityButtonList>
              {!showActivity && <ActivityButton onClick={() => {
                setShowActivity(!showActivity);
              }}>Help I'm Bored</ActivityButton>}
              {showActivity && <ActivityButton onClick={() => {
                setRequestActivity(true);
                refreshData();
              }}>Give Me Another</ActivityButton>}
              <ActivityButton onClick={() => {
                setShowConfig(!showConfig);
              }}>Be More Specific</ActivityButton>
            </ActivityButtonList>
          </Activity>
        </ActivityWrapper>
        
        <ConfigWindow isVisible={showConfig}>
          hiiiiiiii
        </ConfigWindow>
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

const MainWrapper = styled.main``;

const ActivityWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  padding: 50px;
  height: auto;
  width: 800px;
  
  @media (max-width: 800px) {
    width: 500px;
  }
  
  @media (max-width: 500px) {
    width: 300px;
  }
`;

const Activity = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
`;

const Headline = styled.h1`
  min-height: 75px;
`;

const ActivityButtonList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  li button {
    margin-left: auto;
    margin-right: auto;
    width: 200px;
    text-transform: none;
    font-family: 'Wix Madefor Display', sans-serif;
  }
`;

function ActivityButton({children, onClick}) {
  return (
    <li><Button variant="contained" size="large" onClick={onClick}>{children}</Button></li>
  );
}

const ConfigWindow = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        <ConfigWrapper>
          Hello there!
        </ConfigWrapper>
      </motion.div>
    )}
  </AnimatePresence>
)

const ConfigWrapper = styled.section`
  min-height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 50px 50px;
  height: auto;
  width: 800px;
  
  @media (max-width: 800px) {
    width: 500px;
  }
  
  @media (max-width: 500px) {
    width: 300px;
  }
`;

const Config = styled.div`
  width: 100%;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 5px;
  left: 5px;
`;