import buildImg from '../assets/3d-pc-build.png';
import pcImg from '../assets/3d-hero-pc.png';
import ProductCard from './ProductCard.jsx';

const CommunityBuilds = () => {
    const builds = [
        {
            id: 'cb-1',
            category: 'Gaming Build',
            name: 'Stormy Night Build',
            price: '731.90',
            image: buildImg,
            rating: 4.8,
            specs: [
                { label: 'CPU', value: 'i5-13600K' },
                { label: 'GPU', value: 'RTX 3060' },
                { label: 'RAM', value: '16GB' }
            ]
        },
        {
            id: 'cb-2',
            category: 'High-End Build',
            name: 'Aurora Series Pro',
            price: '1,270.99',
            image: buildImg,
            rating: 4.9,
            specs: [
                { label: 'CPU', value: 'i7-14700K' },
                { label: 'GPU', value: 'RTX 4070Ti' },
                { label: 'RAM', value: '32GB' }
            ]
        },
        {
            id: 'cb-3',
            category: 'Stealth Build',
            name: 'Stealth Black Mesh',
            price: '1,190.90',
            image: pcImg,
            rating: 4.7,
            specs: [
                { label: 'CPU', value: 'R7 7800X3D' },
                { label: 'GPU', value: 'RTX 4070' },
                { label: 'RAM', value: '32GB' }
            ]
        },
        {
            id: 'cb-4',
            category: 'Water Cooled',
            name: 'Oceanic Blue Rig',
            price: '850.50',
            image: buildImg,
            rating: 4.5,
            specs: [
                { label: 'CPU', value: 'i5-12400F' },
                { label: 'GPU', value: 'RTX 3070' },
                { label: 'RAM', value: '16GB' }
            ]
        }
    ];

    return (
        <section className="mb-24 px-10">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight uppercase">Trending Community Builds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {builds.map((build) => (
                    <ProductCard
                        key={build.id}
                        id={build.id}
                        category={build.category}
                        title={build.name}
                        image={build.image}
                        price={build.price}
                        rating={build.rating}
                        specs={build.specs}
                        verified={false}
                        buttonText="View"
                    />
                ))}
            </div>
        </section>
    );
};

export default CommunityBuilds;
