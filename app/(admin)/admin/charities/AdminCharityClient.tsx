"use client"
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminCharityClient({ initialCharities }: { initialCharities: any[] }) {
    const [charities, setCharities] = useState(initialCharities);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [events, setEvents] = useState<{event_name: string, event_date: string, location: string}[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const resetForm = () => {
        setName(''); setDescription(''); setLogoUrl(''); setIsFeatured(false); setEvents([]); setImages([]);
        setEditingId(null); setIsFormOpen(false);
    };

    const openEdit = (charity: any) => {
        setName(charity.name);
        setDescription(charity.description);
        setLogoUrl(charity.logo_url || '');
        setIsFeatured(charity.is_featured);
        setEvents(charity.upcoming_events || []);
        setImages(charity.images || []);
        setEditingId(charity.id);
        setIsFormOpen(true);
    };

    const handleUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('charity-images').upload(filePath, file);
        if (uploadError) {
            alert('Upload failed: ' + uploadError.message);
            return null;
        }

        const { data } = supabase.storage.from('charity-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const onLogoChange = async (e: any) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setLoading(true);
        const url = await handleUpload(e.target.files[0]);
        if (url) setLogoUrl(url);
        setLoading(false);
    };

    const onImagesChange = async (e: any) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setLoading(true);
        const newImages = [...images];
        for (const file of e.target.files) {
            const url = await handleUpload(file);
            if (url) newImages.push(url);
        }
        setImages(newImages);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const payload = {
            name, description, logo_url: logoUrl, is_featured: isFeatured, 
            upcoming_events: events, images: images
        };

        try {
            const endpoint = editingId ? `/api/charities/${editingId}` : '/api/charities';
            const method = editingId ? 'PATCH' : 'POST';
            
            const res = await fetch(endpoint, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.error) alert(data.error);
            else {
                alert(`Charity ${editingId ? 'updated' : 'created'} successfully!`);
                window.location.reload();
            }
        } catch(err) {
            alert('Failed to save charity.');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this charity? If active users are attached, this will fail safely.')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/charities/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.error) alert(data.error);
            else {
                setCharities(charities.filter(c => c.id !== id));
            }
        } catch(err) {}
        setLoading(false);
    };

    return (
        <div>
            {!isFormOpen ? (
                <>
                    <button onClick={()=>setIsFormOpen(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 mb-8 inline-block shadow-sm">
                        + Add New Charity
                    </button>

                    <div className="bg-white border text-left border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="p-5">Logo</th>
                                    <th className="p-5">Name</th>
                                    <th className="p-5">Featured</th>
                                    <th className="p-5">Created At</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charities.map(c => (
                                    <tr key={c.id} className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-5">
                                            {c.logo_url ? <img src={c.logo_url} className="h-10 w-10 object-cover rounded shadow-sm" /> : <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">No</div>}
                                        </td>
                                        <td className="p-5 font-bold text-primary">{c.name}</td>
                                        <td className="p-5">{c.is_featured ? <span className="bg-accent/10 text-accent font-bold px-2 py-1 rounded">⭐ Yes</span> : 'No'}</td>
                                        <td className="p-5 font-medium text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="p-5 text-right space-x-4">
                                            <button onClick={()=>openEdit(c)} className="text-primary hover:text-accent font-bold transition">Edit</button>
                                            <button onClick={()=>handleDelete(c.id)} className="text-red-500 hover:text-red-700 font-bold transition">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {charities.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-gray-500">No charities added yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="bg-white border text-left border-gray-200 rounded-2xl shadow-sm overflow-hidden p-8 max-w-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-extrabold text-primary">{editingId ? 'Edit Charity' : 'New Charity'}</h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-900 font-bold">Cancel</button>
                    </div>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-primary mb-2">Charity Name</label>
                            <input required value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-accent outline-none" placeholder="British Heart Foundation" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-primary mb-2">Detailed Description</label>
                            <textarea required rows={5} value={description} onChange={e=>setDescription(e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-accent outline-none" placeholder="Describe the charity's mission..." />
                        </div>
                        
                        <div className="flex items-center gap-4 bg-gray-50 p-4 border border-gray-200 rounded-xl">
                            <input type="checkbox" id="featured" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} className="h-6 w-6 accent-accent rounded" />
                            <label htmlFor="featured" className="font-bold text-primary">Set as Featured Charity (Spotlighted prominently)</label>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                            <label className="block text-sm font-bold text-primary mb-3">Logo Upload</label>
                            {logoUrl && <img src={logoUrl} className="h-20 mb-3 bg-white p-2 border border-gray-200 rounded-lg shadow-sm" />}
                            <input type="file" accept="image/*" onChange={onLogoChange} className="text-sm font-medium" />
                        </div>

                        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                            <label className="block text-sm font-bold text-primary mb-3">Gallery Image Uploads (Multi-select)</label>
                            {images.length > 0 && (
                                <div className="flex gap-3 mb-3 flex-wrap">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img src={img} className="h-24 w-24 object-cover bg-white p-1 border border-gray-200 rounded-lg shadow-sm" />
                                            <button type="button" onClick={()=>setImages(images.filter((_, idx)=>idx!==i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md">X</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <input type="file" multiple accept="image/*" onChange={onImagesChange} className="text-sm font-medium" />
                        </div>

                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                                <label className="block text-lg font-bold text-primary">Upcoming Events</label>
                                <button type="button" onClick={()=>setEvents([...events, {event_name:'', event_date:'', location:''}])} className="text-sm bg-accent/10 text-accent font-bold px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition">+ Add Event</button>
                            </div>
                            
                            {events.map((ev, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-3 mb-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <input placeholder="Event Name" required value={ev.event_name} onChange={e=>{
                                        const newE = [...events]; newE[i].event_name = e.target.value; setEvents(newE);
                                    }} className="border border-gray-300 p-2.5 rounded-lg flex-1 w-full text-sm outline-none focus:ring-1 focus:ring-accent" />
                                    <input type="date" required value={ev.event_date} onChange={e=>{
                                        const newE = [...events]; newE[i].event_date = e.target.value; setEvents(newE);
                                    }} className="border border-gray-300 p-2.5 rounded-lg w-full sm:w-40 text-sm outline-none focus:ring-1 focus:ring-accent" />
                                    <input placeholder="Location" value={ev.location} onChange={e=>{
                                        const newE = [...events]; newE[i].location = e.target.value; setEvents(newE);
                                    }} className="border border-gray-300 p-2.5 rounded-lg w-full sm:w-40 text-sm outline-none focus:ring-1 focus:ring-accent" />
                                    <button type="button" onClick={()=>setEvents(events.filter((_,idx)=>idx!==i))} className="bg-red-100 text-red-600 p-2.5 rounded-lg hover:bg-red-200 font-bold sm:w-auto w-full transition">Remove</button>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-sm text-gray-500 italic">No events configured. Add one to display it on their public profile.</p>}
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 text-lg rounded-xl disabled:opacity-50 transition shadow-lg mt-8">
                            {loading ? 'Saving securely...' : 'Publish Charity Profile'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
