import React from 'react';
import Header from './Header.rc'
import VisTypeLink from './VisTypeLink.rc'
import Leds from './Leds.rc'

const App = () => (
    <div>
        <Header />
        <Leds />
        <p className="vis-types">
            Show: {' '}
            <VisTypeLink visType="fast">
                Fast
            </VisTypeLink>{' '}
            <VisTypeLink visType="fancy">
                Fancy
            </VisTypeLink>
        </p>
    </div>
);

export default App