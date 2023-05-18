import styled from 'styled-components';
import { useState } from "react";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function PhotoCredit({data, onRefresh}) {
    const [ showPhotoInfo, setShowPhotoInfo ] = useState(false);
    
    return <PhotoCreditWrapper className={showPhotoInfo ? "active" : ""}>
        {showPhotoInfo && <PhotoInfo data={data} onRefresh={onRefresh}>
        </PhotoInfo>}
        <PhotoCreditButton onClick={() => {
            setShowPhotoInfo(!showPhotoInfo);
        }}>
            <PhotoCameraIcon style={{ verticalAlign: "middle", marginRight: "5px" }} />
            {data != null && data.location.name}
        </PhotoCreditButton>
    </PhotoCreditWrapper>
}

const PhotoCreditWrapper = styled.section`
  min-width: 350px;
  min-height: 150px;
  max-width: 500px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  color: #aaaaaa;
  transition: color var(--transition-duration) ease;
  
  &.active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    color: #fafafa;
  }
  
  p {
    margin-top: 0;
    margin-bottom: 2px;
  }
  
  h2 {
    font-size: 1.1em;
    margin-top: 0;
    margin-bottom: 10px;
    margin-right: 50px;
  }
  
  p a {
    color: #aaaaaa;
    transition: color var(--transition-duration) ease;
  }

  p a:hover {
    text-decoration: underline;
    cursor: pointer;
    color: #fafafa;
  }
  
  div.refresh-button {
    font-size: 2em;
    position: absolute;
    top: 5px;
    right: 15px;
    color: #aaaaaa;
    width: fit-content;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: color var(--transition-duration) ease;
  }
  
  div.refresh-button svg {
    transform: scale(1.5);
  }
  
  div.refresh-button:hover {
    color: #fafafa;
  }
`;

const PhotoCreditButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  margin-top: auto;
  user-select: none;
`;

function PhotoInfo({ data, onRefresh }) {
    const imageName = data.location?.name ?? "Unknown";
    const userName = data.user?.name ?? "Unknown";
    const imageURL = data.links?.html;
    const userURL = data.user?.links?.html;
    return <div>
        <h2>{imageName}</h2>
        <p>Photo by {userURL ? <a href={userURL} target="_blank">{userName}</a> : <span>{userName}</span>} on <a href={imageURL} target="_blank"> Unsplash</a></p>
        <div className="refresh-button" onClick={onRefresh}><RefreshIcon fontSize="large" /></div>
    </div>
}