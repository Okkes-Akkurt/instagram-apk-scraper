import React, { useState } from 'react';
import axios from 'axios'; // axios'ı import etmeyi unutmayın
import VersionList from './components/VersionList';
import VersionDetail from './components/VersionDetail';

const App = () => {
	const [selectedVersionId, setSelectedVersionId] = useState('');

	const handleVersionClick = async (versionId) => {
		try {
			const response = await axios.get(`http://localhost:3001/${versionId}`);
			setSelectedVersionId(response.data.versionId); // Adjust this line based on your API response structure
		} catch (error) {
			console.error(`Veri çekme hatası (${versionId}):`, error.message);
			setSelectedVersionId({ error: 'Veri çekme hatası' });
		}
	};


	return (
		<div>
			<VersionList onVersionClick={handleVersionClick} />
			<VersionDetail versionId={selectedVersionId} />
		</div>
	);
};

export default App;
