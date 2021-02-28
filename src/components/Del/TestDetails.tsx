import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import {getDetails} from '../../api/details';

const TestDetails = () => {
  const temp = 'ChIJ8XZx5j6uEmsRh7I7MV1Lc6I';
  const [details, setDetails] = useState();

  //   useEffect(() => {
  //     (async () => {
  //       const det = await getDetails(temp);
  //       setDetails(det);
  //     })();
  //   }, [temp]);

  const onPress = async () => {
    const det = await getDetails(temp);
    setDetails(det);
  };

  return (
    <SafeAreaView>
      <Text>hi</Text>
      <Button title="hey" onPress={onPress} />
      <Text>{JSON.stringify(details)}</Text>
    </SafeAreaView>
  );
};

export default TestDetails;
