import React, { useState } from 'react';
import axios from 'axios';
import VersionList from './components/VersionList';
import VersionDetail from './components/VersionDetail';
import './App.css'

const App = () => {
	const [selectedVersionId, setSelectedVersionId] = useState('');

	const handleVersionClick = (versionId) => {
		setSelectedVersionId(versionId);
	};

	return (
		<div>
			<VersionList onVersionClick={handleVersionClick} />
			{selectedVersionId && <VersionDetail versionId={selectedVersionId} />}
		</div>
	);
};

export default App;
