import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';
import axios from 'axios';

interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
  loading: boolean;
}

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const apiUrl = 'https://9eh0h2n03m.execute-api.ap-southeast-1.amazonaws.com/api/v1/provider/1/charger';
const testVar = process.env.HOSTNAME
// const testVar = `testtest`
// get data from api

// axios.get(apiUrl, {
//     headers: {
//         'authentication': `eyJraWQiOiJWR2s3NFZ5SGVjRHIxZmFHT0NuNlB2d0lnVmJrbXNPc0dTeDdWa25IMkdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3OWJhNjU1Yy0yMGExLTcwMzUtOTQ3Zi05MGVjYTIzYjRiNjkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX1pJVXdPdkpVdCIsImNvZ25pdG86dXNlcm5hbWUiOiJsdGsiLCJvcmlnaW5fanRpIjoiMDk2ZmE5YzQtMzY3OS00MzY0LThhMGQtNThjOGJkMjRkODYxIiwiYXVkIjoiNzdmNDBibTY4MHA1MWo0OXRhMzBvZ2QzYWQiLCJldmVudF9pZCI6ImM1OTM0M2JlLWNkY2YtNGEzNC1hYjg4LTUwYWNkZmRmODUxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjk1Mzk1NjU2LCJleHAiOjE2OTY2NTMxMzUsImlhdCI6MTY5NjY0OTUzNSwianRpIjoiNTEwZWI3MmItNWJiYy00NTdlLThlZDItZWYyZjlhMjdjZTlmIiwiZW1haWwiOiJsYXd0ZWthaUBnbWFpbC5jb20ifQ.SeF_tbKFAfT7YtUB-KoQmuL6pETlQXfSrA0ocA6s-efC5OoMZiBKj2_GsMZFjNMylhkv25VGRvxAcMQD4wefjNyq79J8Ns33HsMqf2qVg1VfquNgw-xP8td_ijnPtIPUs06I-WnwVfIeVile_H4PLY1SKkO0WRrW8Y5BAq-klIz3JHq6iMqn83by1VqQzcFML_HJJgv-p7ycxtXfncOCykpTCMUsDaYkY7NaXelt8jv94MexeNe80N8xUw5n4b8LL1zAtHcwEjPTJfzGvmIj2Y7eSqUO6PFYbtyQo4Z9t5KVsX2zgKNjpxCBYDPPMwX5fbhnCNRGPXJWl8oe6PdzzQ`,
//         'Accept' : 'application/json; charset=utf-8',
//         'Content-Type': 'application/json; charset=utf-8'
//     }
// })
// .then(response => {
//     console.log('response', response)
//     console.log('1TEST')
//     // return  response;
// })
// .catch((error) => {
//     console.log(error)
//     console.log('ERROR')
//     //return  error;
// });

async function fetchUsers() {
  try {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
    headers.append('Origin','http://localhost:3000');
     const response = await axios.get(apiUrl,
      {
            headers: {
                'authentication': 'eyJraWQiOiJWR2s3NFZ5SGVjRHIxZmFHT0NuNlB2d0lnVmJrbXNPc0dTeDdWa25IMkdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3OWJhNjU1Yy0yMGExLTcwMzUtOTQ3Zi05MGVjYTIzYjRiNjkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX1pJVXdPdkpVdCIsImNvZ25pdG86dXNlcm5hbWUiOiJsdGsiLCJvcmlnaW5fanRpIjoiMDk2ZmE5YzQtMzY3OS00MzY0LThhMGQtNThjOGJkMjRkODYxIiwiYXVkIjoiNzdmNDBibTY4MHA1MWo0OXRhMzBvZ2QzYWQiLCJldmVudF9pZCI6ImM1OTM0M2JlLWNkY2YtNGEzNC1hYjg4LTUwYWNkZmRmODUxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjk1Mzk1NjU2LCJleHAiOjE2OTY2NTMxMzUsImlhdCI6MTY5NjY0OTUzNSwianRpIjoiNTEwZWI3MmItNWJiYy00NTdlLThlZDItZWYyZjlhMjdjZTlmIiwiZW1haWwiOiJsYXd0ZWthaUBnbWFpbC5jb20ifQ.SeF_tbKFAfT7YtUB-KoQmuL6pETlQXfSrA0ocA6s-efC5OoMZiBKj2_GsMZFjNMylhkv25VGRvxAcMQD4wefjNyq79J8Ns33HsMqf2qVg1VfquNgw-xP8td_ijnPtIPUs06I-WnwVfIeVile_H4PLY1SKkO0WRrW8Y5BAq-klIz3JHq6iMqn83by1VqQzcFML_HJJgv-p7ycxtXfncOCykpTCMUsDaYkY7NaXelt8jv94MexeNe80N8xUw5n4b8LL1zAtHcwEjPTJfzGvmIj2Y7eSqUO6PFYbtyQo4Z9t5KVsX2zgKNjpxCBYDPPMwX5fbhnCNRGPXJWl8oe6PdzzQ',
                'Accept' : 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
      
      );
    //  const users = response.data;
    //  console.log('List of users:');
    //  console.log(users);
    console.log(response)
  } catch (error) {
     console.error('Error message q:', error);
  }
}
fetchUsers();


const payload = {
    "company_name": "string",
    "description": "string",
    "id": 0,
    "status": "string",
    "user_email": "string"
  }
function ScrollComponent() {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [list, setList] = useState<DataType[]>([]);

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        // console.log(res.results);
        // console.log(testVar)
        setData(res.results);
        setList(res.results);
      });
      
  }, []);
  
  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar src={item.picture.large} />}
              title={<a href="https://ant.design">{item.name?.last}</a>}
              user_email={item.user_email}
              description={item.description}
            />
            <div>content</div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default ScrollComponent;