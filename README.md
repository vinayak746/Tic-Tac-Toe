<div align="center">

# 🎮 Nova Tic-Tac-Toe

### *The classic game, reimagined with style and intelligence*

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://tic-tac-toe-vi.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

[🎯 Play Now](https://tic-tac-toe-vi.vercel.app) • [📖 Documentation](#-features) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

Nova Tic-Tac-Toe isn't just another implementation—it's a **full-featured gaming platform** that combines elegant design with sophisticated gameplay mechanics. Whether you're challenging an unbeatable AI, competing with friends locally, or battling opponents across the globe, Nova delivers a premium experience.

### ✨ What Makes It Special

- 🎨 **Stunning UI/UX** - Glassmorphic design with neon accents and smooth animations
- 🤖 **Smart AI** - Three difficulty levels from beginner-friendly to mathematically unbeatable
- 🌐 **Real-time Multiplayer** - Instant synchronization with Socket.io
- 📊 **Persistent Stats** - Your victories are remembered across sessions
- 🎯 **Zero Friction** - Jump into any mode within seconds

---

## 🎮 Game Modes

<table>
<tr>
<td width="33%">

### 👥 Pass & Play
*Classic local multiplayer*

- Two players, one device
- Complete move history
- Persistent scoreboard
- Time travel through moves
- Perfect for quick matches

</td>
<td width="33%">

### 🤖 AI Challenge
*Test your strategic thinking*

**Easy** - Random moves  
**Medium** - Defensive strategy  
**Hard** - Minimax algorithm  

- Choose your symbol (X or O)
- Adaptive difficulty
- Learn from patterns
- Instant AI responses

</td>
<td width="33%">

### 🌐 Multiplayer Arena
*Compete globally*

- Create private rooms
- Share 6-character codes
- Real-time synchronization
- Reconnection handling
- Opponent indicators
- Turn-based gameplay

</td>
</tr>
</table>

---

## 🚀 Live Demo

**[🎯 Try it now at tic-tac-toe-vi.vercel.app](https://tic-tac-toe-vi.vercel.app)**

<div align="center">

### Quick Start Guide

1. Visit the link above
2. Choose your mode
3. Start playing instantly - no signup required!

</div>

---

## 💎 Key Features

### 🎨 Design Excellence
- **Glassmorphic UI** with gradient backgrounds and backdrop blur
- **Neon accent colors** for visual hierarchy and feedback
- **Responsive layout** optimized for all screen sizes
- **Smooth animations** for state transitions and interactions
- **Dark theme** optimized for extended play sessions

### 🧠 Intelligence
- **Minimax algorithm** powers the unbeatable AI
- **Heuristic evaluation** for medium difficulty
- **Randomized moves** for beginner-friendly gameplay
- **Move prediction** and defensive blocking

### 🌐 Multiplayer Magic
- **Room-based system** with unique 6-character codes
- **Socket.io integration** for sub-100ms response times
- **Automatic reconnection** if connection drops
- **Turn synchronization** prevents race conditions
- **Player status indicators** show connection state

### 📊 Stats & History
- **LocalStorage persistence** for scores across sessions
- **Move-by-move history** in single-player modes
- **Time travel** - jump to any previous game state
- **Win/loss/draw tracking** with automatic updates
- **Session continuity** - scores survive refreshes

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, Vite, React Router |
| **Styling** | Tailwind CSS, Custom Gradients |
| **Real-time** | Socket.io Client |
| **State** | React Hooks, LocalStorage |
| **Effects** | Confetti.js, CSS Animations |
| **Code Quality** | ESLint, Prettier |
| **Deployment** | Vercel (Frontend) |

</div>

### Why These Choices?

- **React 18** - Concurrent rendering for smooth animations
- **Vite** - Lightning-fast HMR during development
- **Tailwind** - Utility-first CSS for consistent design
- **Socket.io** - Industry-standard for real-time communication
- **Vercel** - Edge network for global low-latency access

---

## 🏃 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vinayak746/tic-tac-toe.git
cd tic-tac-toe

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Development server runs at `http://localhost:5173`

---

## 🎯 How to Play

### Pass & Play Mode
1. Click **"Set up a match"** on home screen
2. Enter player names (optional)
3. Select **"Player vs Player"**
4. Click **"Start game"**
5. Take turns clicking empty squares
6. Use move history to review or undo

### AI Challenge
1. Choose difficulty: Easy, Medium, or Hard
2. Select your symbol (X goes first)
3. Click any square to make your move
4. AI responds automatically
5. Try to beat the unbeatable!

### Multiplayer Arena
1. Click **"Multiplayer lobby"**
2. Host: Click **"Create & copy room code"**
3. Share the 6-character code with your friend
4. Guest: Enter the code and click **"Join room"**
5. Host clicks **"Start game"** when both are ready
6. Play alternates automatically

---

## 🎨 UI/UX Highlights

### Visual Design
- **Gradient Backgrounds** - Smooth blue-to-indigo transitions
- **Glassmorphism** - Frosted glass effect on cards
- **Neon Accents** - Sky blue and indigo highlights
- **Rounded Corners** - Modern, friendly aesthetic
- **Shadow Depth** - Subtle 3D layering

### Interaction Design
- **Hover States** - Visual feedback on all interactive elements
- **Active States** - Scale animations on button presses
- **Loading States** - Skeleton screens during connections
- **Error States** - Friendly messages with recovery options
- **Success States** - Confetti celebration on wins

### Accessibility
- **Keyboard Navigation** - Full tab support
- **High Contrast** - WCAG AA compliant colors
- **Screen Reader** - Semantic HTML throughout
- **Focus Indicators** - Visible focus rings
- **Responsive Text** - Scales appropriately on all devices

---

## 🧪 Testing Scenarios

### ✅ Functional Tests
- [x] Player vs Player complete game flow
- [x] AI Easy difficulty random moves
- [x] AI Medium defensive blocking
- [x] AI Hard unbeatable algorithm
- [x] Score persistence across refreshes
- [x] Move history navigation
- [x] Multiplayer room creation
- [x] Multiplayer room joining
- [x] Socket reconnection handling
- [x] Turn synchronization

### 🎯 Edge Cases
- [x] Rapid successive clicks
- [x] Network disconnection/reconnection
- [x] Multiple tabs same room
- [x] Invalid room codes
- [x] Empty player names
- [x] Browser back button handling

---

## 📦 Project Structure

```
tic-tac-toe/
├── src/
│   ├── components/
│   │   ├── Game.jsx              # Core game board & logic
│   │   ├── PlayerForm.jsx        # Mode selection & setup
│   │   ├── MultiplayerSetup.jsx  # Room creation/joining
│   │   └── Lobby.jsx             # Multiplayer waiting room
│   ├── socket.js                 # Socket.io client configuration
│   ├── App.jsx                   # Route definitions
│   └── main.jsx                  # Application entry point
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind customization
└── package.json                  # Dependencies & scripts
```

---

## 🔮 Roadmap

### Phase 1: Core Enhancements ✨
- [ ] **Spectator Mode** - Watch live games without playing
- [ ] **AI Personalities** - Aggressive, Defensive, Balanced styles
- [ ] **Sound Effects** - Subtle audio feedback for moves
- [ ] **Themes** - Light mode and additional color schemes

### Phase 2: Social Features 🌟
- [ ] **Friend System** - Add and challenge friends
- [ ] **Leaderboards** - Global and friend rankings
- [ ] **Match History** - Review past games with replay
- [ ] **Achievements** - Unlock badges for milestones

### Phase 3: Advanced Gameplay 🎮
- [ ] **Tournament Mode** - Bracket-style competitions
- [ ] **Timed Matches** - Add pressure with countdown timers
- [ ] **Custom Rules** - Board size variations (4x4, 5x5)
- [ ] **AI Training** - Save and load custom AI personalities

### Phase 4: Platform Expansion 📱
- [ ] **Mobile Apps** - Native iOS and Android versions
- [ ] **PWA Support** - Install as standalone app
- [ ] **Offline Mode** - Play without internet
- [ ] **Cross-Platform Sync** - Continue games across devices

---

## 🤝 Contributing

Contributions make the open-source community amazing! Here's how you can help:

### Ways to Contribute
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features or improvements
- 📖 Improve documentation
- 🎨 Design new UI components
- 🔧 Submit pull requests

### Development Workflow

```bash
# 1. Fork the repository

# 2. Create feature branch
git checkout -b feat/amazing-feature

# 3. Make your changes

# 4. Run linting
npm run lint

# 5. Commit with conventional commits
git commit -m "feat: add amazing feature"

# 6. Push to your fork
git push origin feat/amazing-feature

# 7. Open a Pull Request
```

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style updates
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means
✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  

Just include the original copyright and license notice!

---

## 🙏 Acknowledgments

- **React Team** - For the incredible framework
- **Tailwind Labs** - For the utility-first CSS approach
- **Socket.io** - For making real-time simple
- **Vercel** - For seamless deployment
- **You** - For checking out this project!

---

## 📞 Support & Contact

### Found a Bug?
Open an [issue on GitHub](https://github.com/vinayak746/tic-tac-toe/issues)

### Have a Question?
Start a [discussion](https://github.com/vinayak746/tic-tac-toe/discussions)

### Want to Connect?
- 🌐 Website: [tic-tac-toe-vi.vercel.app](https://tic-tac-toe-vi.vercel.app)
- 💼 LinkedIn: [vinayak-arora746](https://linkedin.com/in/vinayak-arora746)

---

<div align="center">

### ⭐ Star this repo if you enjoyed playing!

**[🎮 Play Nova Tic-Tac-Toe Now](https://tic-tac-toe-vi.vercel.app)**

Made with ❤️ and ☕ by [Vinayak](https://github.com/vinayak746)

---

*"The best way to predict the future is to implement it."*

</div>
