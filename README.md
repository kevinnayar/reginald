# 📢 marconi

An event-based fullstack app written in typescript
- API writes broadcast server events
- Services listen to server events and perform DB mutations
- DB mutations may result in client events broadcasted via WebSockets to client
- React frontend listens for client events and renders changes



