// src/pages/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import styles from '../styles/TaskDetail.module.css';

function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [taskMembers, setTaskMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const currentUser = auth.currentUser;

  // Fetch task and member details
  useEffect(() => {
    const fetchTask = async () => {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      const taskData = taskDoc.data();
      setTask(taskData);

      // Fetch details of task members
      const q = query(collection(db, 'users'), where('__name__', 'in', taskData.members));
      const userDocs = await getDocs(q);
      const members = userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTaskMembers(members);
    };

    fetchTask();
  }, [taskId]);

  const handleSendMessage = async () => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        messages: arrayUnion({
          sender: currentUser.uid,
          message: newMessage,
        }),
      });
      setNewMessage('');
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      setTask(taskDoc.data()); // Refresh task data
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChangeStatus = async (e) => {
    try {
      const status = e.target.value;
      await updateDoc(doc(db, 'tasks', taskId), { status });
      setNewStatus(status);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Task Detail</h2>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>

      <h3>Task Members</h3>
      <ul className={styles.memberList}>
        {taskMembers.map((member) => (
          <li key={member.id}>{member.email || member.name}</li>
        ))}
      </ul>

      <select value={newStatus} onChange={handleChangeStatus}>
        <option value="pending">Pending</option>
        <option value="working">Working</option>
        <option value="delayed">Delayed</option>
        <option value="completed">Completed</option>
      </select>

      <div className={styles.messages}>
        <h3>Messages</h3>
        {task.messages?.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender === currentUser.uid ? 'You' : 'Other'}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <textarea
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}

export default TaskDetail;
