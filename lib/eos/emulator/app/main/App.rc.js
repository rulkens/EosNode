import React from 'react';
import Header from './Header.rc'
import VisTypeLink from './VisTypeLink.rc'
import DirectionLink from './DirectionLink.rc'
import Leds from './Leds.rc'

const App = () => (
    <div>
        <Header />
        <Leds />
        <p className="vis-types toggle-links">
            Rendering: {' '}
            <VisTypeLink visType="fast">
                Fast
            </VisTypeLink>{' '}
            <VisTypeLink visType="fancy">
                Fancy
            </VisTypeLink>
        </p>

        <p className="directions toggle-links">
            View Direction: {' '}
            <DirectionLink direction="vertical">
                Vertical
            </DirectionLink>{' '}
            <DirectionLink direction="horizontal">
                Horizontal
            </DirectionLink>
        </p>
    </div>
);

export default App