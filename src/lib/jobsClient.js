import { supabase } from './supabaseClient';

export const getJobs = async (includeDrafts = false) => {
    let query = supabase.from('jobs').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });

    if (!includeDrafts) {
        query = query.eq('status', 'published');
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
    return data;
};

export const getJobBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching job by slug:', error);
        throw error;
    }
    return data;
};

export const getJobById = async (id) => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching job by id:', error);
        throw error;
    }
    return data;
};

export const createJob = async (jobData) => {
    const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select();

    if (error) {
        console.error('Error creating job:', error);
        throw error;
    }
    return data[0];
};

export const updateJob = async (id, jobData) => {
    const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating job:', error);
        throw error;
    }
    return data[0];
};

export const deleteJob = async (id) => {
    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
    return true;
};

// Application API
export const submitApplication = async (applicationData, file) => {
    try {
        let resumeUrl = '';

        // Upload file
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `resumes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('job_applications')
                .upload(filePath, file);

            if (uploadError) throw uploadError;
            resumeUrl = filePath;
        }

        const application = {
            ...applicationData,
            resume_url: resumeUrl
        };

        const { data, error } = await supabase
            .from('job_applications')
            .insert([application])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};

export const getApplications = async () => {
    const { data, error } = await supabase
        .from('job_applications')
        .select('*, jobs(title)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
    return data;
};

export const updateApplicationStatus = async (id, status) => {
    const { data, error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
    return data[0];
};
