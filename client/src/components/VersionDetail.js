import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VersionDetail = ({ versionId }) => {
	const [versionDetails, setVersionDetails] = useState(null);

	useEffect(() => {
		const fetchVersionDetails = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/${versionId}`);
				setVersionDetails(response.data);
			} catch (error) {
				console.error('Veri çekme hatası:', error.message);
				setVersionDetails({ error: 'Veri çekme hatası' });
			}
		};

		fetchVersionDetails();
	}, [versionId]);

	return (
		<div>
			<h2>{versionId} Detayları</h2>
			{versionDetails !== null ? (
				versionDetails.error ? (
					<p>{versionDetails.error}</p>
				) : versionDetails.variants && versionDetails.variants.length > 0 ? (
					<ul>
						{versionDetails.variants.map((variant) => (
							<li key={variant.variantId}>
								{variant.variantId} - {variant.architecture} - {variant.minAndroidVersion} -{' '}
								{variant.dpi}
							</li>
						))}
					</ul>
				) : (
					<p>Detaylar bulunamadı.</p>
				)
			) : (
				<p>Detaylar yükleniyor...</p>
			)}
		</div>
	);
};

export default VersionDetail;
