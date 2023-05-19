import Head from 'next/head'
import styled from 'styled-components'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import PhotoCredit from "../components/PhotoCredit";
import { motion, AnimatePresence } from "framer-motion"
import { blue } from '@mui/material/colors';
import { Box, Slider, Checkbox, FormGroup } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Home() {
  // Website state
  const [activity, setActivity] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // https://stackoverflow.com/questions/69000300
  // Variables used to request API data
  const [refresh, setRefresh] = useState(false);
  const [requestActivity, setRequestActivity] = useState(true);
  const [requestWallpaper, setRequestWallpaper] = useState(true);

  // Activity filters
  const [accessibility, setAccessibility] = useState([0.0, 1.0]);
  const [participants, setParticipants] = useState(6);
  const [type, setType] = useState(null);
  const [freeOnly, setFreeOnly] = useState(false);

  function onChangeSettings(accessibility, participants, type, freeOnly) {
    setAccessibility(accessibility);
    setParticipants(participants);
    setType(type);
    setFreeOnly(freeOnly);
  }

  // https://articles.wesionary.team/using-localstorage-with-next-js-a-beginners-guide-7fc4f8bfd9dc
  // Load local storage
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      let filterData = JSON.parse(localStorage.getItem("filterData"));
      if(filterData != null) {
        setAccessibility(filterData.accessibility);
        setParticipants(filterData.participants);
        setType(filterData.type);
        setFreeOnly(filterData.freeOnly);
        console.log("Local storage loaded!");
      }
    }
  }, []);
  
  // Listen to state changes to activity settings
  useEffect(() => {
    setRequestActivity(true);
    refreshData();
    localStorage.setItem("filterData", JSON.stringify({
      accessibility, participants, type, freeOnly
    }));
  }, [accessibility, participants, type, freeOnly])

  const refreshData = () => setRefresh(!refresh);

  // Fetch data based on whatever is requested
  useEffect(() => {
    const BORED_URL = `http://www.boredapi.com/api/activity?minaccessibility=${accessibility[0]}&maxaccessibility=${accessibility[1]}` + (participants < 6 ? `&participants=${participants}` : "") + (freeOnly ? "&price=0.0" : "") + (type != null ? `&type=${type}` : "");
    setLoading(true);
    if(requestActivity) {
      setRequestActivity(false);
      fetch(BORED_URL)
        .then((res) => res.json())
        .then((data) => {
          if(data.error) {
            setActivity({
              activity: "No activity found :("
            });
          } else {
            setActivity(data);
          }
        });
    }

    if(requestWallpaper) {
      setRequestWallpaper(false);
      fetch("api/unsplash")
        .then((res) => res.json())
        .then((data) => {
          if(!data.error) {
            setWallpaper(data);
          }
        })
    }
    setLoading(false);
  }, [refresh])

  // Basic loading screen
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
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <MainWrapper>
        <ActivityWrapper as={motion.section} animate={{
          height: "auto",
          paddingTop: showConfig ? "15px" : "50px",
          paddingBottom: showConfig ? "15px" : "50px"
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
              }}>Find Something To Do</ActivityButton>}
              {showActivity && <ActivityButton onClick={() => {
                setRequestActivity(true);
                refreshData();
              }}>Give Me Another</ActivityButton>}
              {showActivity && <ActivityButton onClick={() => {
                setShowConfig(!showConfig);
              }}>{showConfig ? "Hide Controls" : "Be More Specific"}</ActivityButton>}
            </ActivityButtonList>
          </Activity>
        </ActivityWrapper>

        <ConfigWindow isVisible={showConfig} accessibility={accessibility} participants={participants} type={type} freeOnly={freeOnly} onChangeSettings={onChangeSettings} />
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
  overflow-y: scroll;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainWrapper = styled.main`
  height: 100%;
  padding-top: var(--page-margin);
`;

const ActivityWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 10px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  padding: 50px 40px;
  height: auto;
  width: 800px;
  
  @media (max-width: 800px) {
    width: 500px;
  }
  
  @media (max-width: 500px) {
    width: 300px;
  }
`;

const Activity = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
`;

const Headline = styled.h1`
  min-height: 90px;
`;

const ActivityButtonList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  li button {
    margin-left: auto;
    margin-right: auto;
    width: 250px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-transform: none;
    font-family: var(--font-family);
  }
  
  @media (max-width: 800px) {
    gap: 10px;
  }
  
  @media (max-width: 500px) {
    li button {
      width: 200px;
    }
  }
  
`;

function ActivityButton({ children, onClick }) {
  return (
    <li><Button variant="contained" size="large" onClick={onClick}>{children}</Button></li>
  );
}

const ConfigWindow = function ({ isVisible, accessibility, participants, type, freeOnly, onChangeSettings }) {
  function toggleActivityType(newType) {
    if(newType == type) {
      newType = null;
    }
    onChangeSettings(accessibility, participants, newType, freeOnly);
  }
  
  // https://stackoverflow.com/questions/72238021/how-to-apply-media-query-in-nextjs
  const matches = useMediaQuery("(max-width: 500px)");
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.1 }}
          style={{
            paddingBottom: "var(--page-margin)"
          }}
        >
          <ConfigWrapper>
            <h2>Be More Specific</h2>
            <FormGroup>
              <Box className="free-only-box">
                <label htmlFor="freeOnly">Free activities only?</label>
                <Checkbox id="freeOnly" sx={{
                  color: blue[800],
                  '&.Mui-checked': {
                    color: blue[600],
                  }
                }} checked={freeOnly} onChange={(e, newVal) => {
                  onChangeSettings(accessibility, participants, type, newVal);
                }} />
              </Box>
              <Box>
                <label htmlFor="type">I want to...</label>
                <ActivityTypeButtons id="type">
                  <ActivityTypeButton type="education" current={type} onChange={toggleActivityType}>Learn</ActivityTypeButton>
                  <ActivityTypeButton type="recreational" current={type} onChange={toggleActivityType}>Have Fun</ActivityTypeButton>
                  <ActivityTypeButton type="social" current={type} onChange={toggleActivityType}>Socialize</ActivityTypeButton>
                  <ActivityTypeButton type="diy" current={type} onChange={toggleActivityType}>Craft</ActivityTypeButton>
                  <ActivityTypeButton type="charity" current={type} onChange={toggleActivityType}>Help Others</ActivityTypeButton>
                  <ActivityTypeButton type="cooking" current={type} onChange={toggleActivityType}>Cook</ActivityTypeButton>
                  <ActivityTypeButton type="relaxation" current={type} onChange={toggleActivityType}>Relax</ActivityTypeButton>
                  <ActivityTypeButton type="music" current={type} onChange={toggleActivityType}>Listen / Play Music</ActivityTypeButton>
                  <ActivityTypeButton type="busywork" current={type} onChange={toggleActivityType}>Be Productive</ActivityTypeButton>
                </ActivityTypeButtons>

              </Box>
              <Box>
                <label htmlFor="accessibility">How accessible is the activity?</label>
                <Slider
                  id="accessibility"
                  getAriaLabel={() => 'Accessibility'}
                  value={accessibility}
                  marks={[
                    {
                      value: 0,
                      label: "Easy"
                    },
                    {
                      value: 0.5,
                      label: "Moderate"
                    },
                    {
                      value: 1,
                      label: "Difficult"
                    }
                  ]}
                  onChange={(e, newVal) => {
                    onChangeSettings(newVal, participants, type, freeOnly)
                  }}
                  valueLabelDisplay="off"
                  getAriaValueText={() => `Between ${accessibility[0]} and ${accessibility[1]}`}
                  step={0.1}
                  min={0.0}
                  max={1.0}
                  disableSwap
                />
              </Box>
              <Box>
                <label htmlFor="participants">How many people?</label>
                <Slider
                  id="participants"
                  getAriaLabel={() => 'Participants'}
                  value={participants}
                  marks={matches ? [
                    // Not enough space to show all labels without overlapping
                    // so only display the first and last
                    {
                      value: 1,
                      label: "Just me"
                    },
                    {
                      value: 2
                    },
                    {
                      value: 3
                    },
                    {
                      value: 4
                    },
                    {
                      value: 5
                    },
                    {
                      value: 6,
                      label: "Doesn't matter"
                    }
                  ] : [
                    {
                      value: 1,
                      label: "Just me"
                    },
                    {
                      value: 2,
                      label: "2"
                    },
                    {
                      value: 3,
                      label: "3"
                    },
                    {
                      value: 4,
                      label: "4"
                    },
                    {
                      value: 5,
                      label: "5"
                    },
                    {
                      value: 6,
                      label: "Doesn't matter"
                    },
                  ]}
                  onChange={(e, newVal) => {
                    onChangeSettings(accessibility, newVal, type, freeOnly)
                  }}
                  valueLabelDisplay="off"
                  getAriaValueText={() => participants}
                  step={1}
                  min={1}
                  max={6}
                  track={false}
                />
              </Box>
            </FormGroup>
          </ConfigWrapper>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

const ConfigWrapper = styled.main`
  min-height: 50px;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px 30px;
  height: auto;
  width: 800px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 0;
    text-align: center;
  }
  
  label {
    font-weight: bold;
  }
  
  .MuiFormGroup-root {
    gap: 10px;
  }
  
  .MuiBox-root {
    width: 75%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .MuiBox-root.free-only-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    flex-wrap: wrap;
  }
  
  .MuiSlider-markLabel {
    font-family: var(--font-family);
    color: var(--text-color);
  }

  @media (max-width: 800px) {
    width: 500px;
  }
  
  @media (max-width: 500px) {
    width: 300px;
    
    .MuiBox-root.free-only-box {
      justify-content: center;
      margin-top: 10px;
    }
  }
`;

const ActivityTypeButtons = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style-type: none;
  justify-content: center;
  padding: 0;
  gap: 10px;
  
  button {
    text-transform: none;
  }
`;

function ActivityTypeButton({ children, type, current, onChange }) {
  return <li>
    <Button variant={type == current ? "contained" : "outlined"} onClick={() => {
      onChange(type);
    }}>{children}</Button>
  </li>
}
const Footer = styled.footer`
  position: fixed;
  bottom: 5px;
  left: 5px;
`;