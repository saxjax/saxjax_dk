# Angular Instrument Tuner

An Angular 19 application for a music instrument tuner optimized for singing and wind instruments, following Clean Architecture principles and Clean Code practices.

## Architecture Overview

The application is structured according to Clean Architecture principles, with clear separation of concerns between the domain, application, and presentation layers.

```
src/app/tuner/
├── domain/             # Domain layer - core business logic
│   ├── models/         # Domain models
│   ├── ports/          # Interface contracts
│   └── dsl/            # Domain Specific Language
├── application/        # Application layer - use cases and state
│   ├── services/       # Services implementing domain ports
│   └── state/          # State management with signals
└── presentation/       # Presentation layer - UI components
    ├── components/     # Presentational components
    └── containers/     # Smart container components
```

### Domain Layer

The domain layer contains the core business logic and is independent of any framework or external concerns. It includes:

- **Models**: Value objects representing the core domain concepts (Pitch, Note, TuningSession, etc.)
- **Ports**: Interface contracts that define the boundaries between layers
- **DSL**: Domain Specific Language for musical notation

### Application Layer

The application layer coordinates between the domain and presentation layers. It includes:

- **Services**: Implementations of the domain ports that interact with external systems
- **State**: Reactive state management using Angular signals

### Presentation Layer

The presentation layer is responsible for rendering the UI and handling user interactions. It includes:

- **Components**: Presentational components that render data and emit events
- **Containers**: Smart components that coordinate between the state and presentational components

## Clean Code Principles

The codebase follows Clean Code principles:

- **Meaningful Names**: All variables, functions, and classes have clear, intention-revealing names
- **Single Responsibility**: Each class and function has a single responsibility
- **Small Functions**: Functions are kept small and focused
- **Comments**: Code is self-documenting with minimal comments
- **Error Handling**: Consistent error handling patterns
- **Tests**: High test coverage with proper isolation

## SOLID Principles

The codebase follows SOLID principles:

- **Single Responsibility Principle**: Each class has a single reason to change
- **Open/Closed Principle**: Classes are open for extension but closed for modification
- **Liskov Substitution Principle**: Subtypes can be substituted for their base types
- **Interface Segregation Principle**: Clients are not forced to depend on interfaces they don't use
- **Dependency Inversion Principle**: High-level modules depend on abstractions, not details

## Features

- Real-time pitch detection using the Web Audio API
- Multiple pitch detection algorithms (Autocorrelation, YIN)
- Visual feedback on pitch accuracy
- Recording and playback of tuning sessions
- Customizable preferences
- Responsive design

## Technical Details

- **Angular Signals**: Used for reactive state management
- **Web Audio API**: Used for audio capture and analysis
- **Canvas API**: Used for rendering the frequency graph
- **LocalStorage**: Used for persistence of sessions and preferences
- **Standalone Components**: All components are standalone with explicit imports

## Usage

The tuner can be accessed in two ways:

### Standalone Page

1. Navigate to the tuner page at `/tuner`
2. Click the "Start Tuner" button to begin capturing audio
3. Sing or play a note to see the detected pitch and deviation
4. Use the control panel to adjust settings and record sessions

### Floating Portal

1. On the products page, click the floating "Open Tuner" button in the bottom right corner
2. The tuner will open in a scrollable portal window on top of the page
3. Use the tuner as normal
4. Click the close button in the top right of the portal to close it
