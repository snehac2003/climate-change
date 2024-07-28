import React, { useState } from 'react';
import Scene1 from './Scene1';
import Scene2 from './Scene2';
import Scene3 from './Scene3';
import Scene4 from './Scene4';

const Slideshow = () => {
  const [currentScene, setCurrentScene] = useState(1);

  const nextScene = () => {
    setCurrentScene(currentScene + 1);
  };

  const previousScene = () => {
    setCurrentScene(currentScene - 1);
  };

  return (
    <div>
      {currentScene === 1 && <Scene1 nextScene={nextScene} />}
      {currentScene === 2 && <Scene2 previousScene={previousScene} nextScene={nextScene} />}
      {currentScene === 3 && <Scene3 previousScene={previousScene} nextScene={nextScene} />}
      {currentScene === 4 && <Scene4 previousScene={previousScene} />}
    </div>
  );
};

export default Slideshow;
