# One-to-One Video Chat with WebRTC, React, and Firebase

## Overview

Welcome to the repository documenting my journey into real-time communication with WebRTC! This project showcases a simple one-to-one video chat application developed using React and Firebase.

## What is WebRTC?

**WebRTC (Web Real-Time Communication)** is an open-source project that enables real-time audio, video, and data sharing between browsers and mobile applications via simple APIs. It is designed to provide high-quality, low-latency communication directly in web browsers without requiring a server in between the two parties (once the connection is set). 
Key features of WebRTC include:
- **Audio and Video Communication:** Facilitates high-quality audio and video streaming.
- **Data Channels:** Allows peer-to-peer data exchange.
- **Security:** Ensures secure communication through encryption.

WebRTC powers a variety of applications such as video conferencing, live streaming, and online gaming, enabling seamless real-time interactions.

## How WebRTC Connection is Set Up

Setting up a WebRTC connection involves several key steps. Here’s a step-by-step guide:

1. Each party should set up a remote peer connection
2. Then on eof them will create an offer and the other creates an answer
3. Each party should send the other its ice condidates (ip adresses and ports the other can communicate to it with)


## Challenges and Solutions

1. **Signaling and Connection Management:**

   - **Challenge:** We need a way to share the offer/answer descriptions between the two parties rather then copy/paste them.
   - **Solution:** I used Firebase Realtime Database for signaling, implementing a robust mechanism to exchange offer, answer, and ICE candidates between peers.

2. **Managing React State with WebRTC Objects:**

   - **Challenge:** WebRTC objects (like `RTCPeerConnection`) have their own state, which can be challenging to manage within React's component-based architecture.
   - **Solution:** Utilized React hooks (`useState`, `useEffect`) to maintain and synchronize WebRTC state with React components. This approach ensures state updates are handled correctly throughout the component lifecycle.

3. **Interacting with Media Streams:**

   - **Challenge:** Handling media streams from the native web API and integrating them with React components posed several challenges.
   - **Solution:** Leveraged the `useRef` hook to access and manipulate DOM elements directly, enabling smooth handling of media streams and video playback.

## Learning Outcomes

- Gained a deeper understanding of WebRTC and its capabilities for real-time communication.
- Improved skills in managing complex state within React applications.
- Developed strategies for integrating native web APIs with modern JavaScript frameworks.
- Enhanced problem-solving abilities by tackling real-world challenges in WebRTC implementation.


## Usage

To get started with this project, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Ilyeshaddad337/webrtc-one-2-one-video-chat.git
   cd webrtc-one-2-one-video-chat
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Firebase:**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a new web app to your Firebase project.
   - Obtain the Firebase configuration object and replace the placeholder in `src/firebase/db.js` with your configuration details.

4. **Run the Application:**

   ```bash
   npm run dev
   ```

5. **Open the Application:**

   - Open your browser and navigate to `http://localhost:5173`.
   - create a room
   - Share the room id with another user to initiate a video chat.



## Repository Contents

- `src/`: Contains the React components and main application logic.
- `public/`: Static assets and HTML file.
- `README.md`: This file, providing an overview and setup instructions.

## Conclusion

This project was a rewarding experience, offering insights into real-time communication technologies and practical skills in web development. I hope this repository serves as a helpful resource for anyone interested in exploring WebRTC with React and Firebase.

Feel free to explore the code and reach out if you have any questions or suggestions!

## Connect

If you're interested in discussing this project or similar technologies, connect with me on [LinkedIn](https://www.linkedin.com/in/ilyes-haddad-417046264/) or check out my other projects on [GitHub](https://github.com/Ilyeshaddad337).

