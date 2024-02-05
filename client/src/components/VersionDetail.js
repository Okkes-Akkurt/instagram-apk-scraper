import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VersionDetail = ({ versionId }) => {
	const [versionDetails, setVersionDetails] = useState([]);
	const [compHeader, setCompHeader] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchVersionDetails = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/versions/${versionId}`);
				setVersionDetails(response.data.variants);
				setCompHeader(response.data.version);
			} catch (error) {
				console.error('Veri çekme hatası:', error.message);
				setError(`Veri çekme hatası: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchVersionDetails();
	}, [versionId]);

	return (
		<div>
			{loading ? (
				<p>Detaylar yükleniyor...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<div>
					<h2>{compHeader} Detayları</h2>
					<ol className='olcards'>
						{versionDetails.map((variant, index) => (
							<li
								key={index}
								style={{ '--cardColor': variant.cardColor || '#fc374e' }}>
								<div className='content'>
									<div className='variantId'>
										<span>variantId : </span>
										{variant.variantId}
									</div>
									<div className='architecture'><span>architecture : </span>{variant.architecture}</div>
									<div className='minAndroidVersion'>
										<span>minAndroidVersion : </span>{variant.minAndroidVersion}
									</div>
									<div className='dpi'><span>dpi : </span>{variant.dpi}</div>
								</div>
							</li>
						))}
					</ol>
				</div>
			)}
		</div>
	);
};

export default VersionDetail;
