import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { personalInfo, experience, education, skills, certifications } from '../../data';

// Register a font that supports Turkish characters
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Roboto',
        fontSize: 11,
        color: '#333',
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        borderBottom: '1px solid #ddd',
        paddingBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#2563eb',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
        color: '#4b5563',
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        fontSize: 9,
        color: '#6b7280',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#111827',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: 4,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    item: {
        marginBottom: 10,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemTitle: {
        fontWeight: 700,
        fontSize: 12,
    },
    itemSubtitle: {
        color: '#4b5563',
        fontSize: 10,
        marginTop: 1,
    },
    itemDate: {
        fontSize: 10,
        color: '#6b7280',
        minWidth: 80,
        textAlign: 'right',
    },
    description: {
        marginTop: 4,
        fontSize: 10,
        color: '#4b5563',
        textAlign: 'justify',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillTag: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 9,
        color: '#374151',
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
    },
});

export const CVDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{personalInfo.name}</Text>
                <Text style={styles.title}>{personalInfo.title}</Text>
                <View style={styles.contactInfo}>
                    <Text>📍 {personalInfo.location}</Text>
                    <Link src={`mailto:${personalInfo.email}`} style={styles.link}>📧 {personalInfo.email}</Link>
                    <Link src={personalInfo.linkedin} style={styles.link}>🔗 LinkedIn</Link>
                    <Link src={personalInfo.github} style={styles.link}>💻 GitHub</Link>
                </View>
            </View>

            {/* Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hakkımda</Text>
                {personalInfo.about.map((p, i) => (
                    <Text key={i} style={{ marginBottom: 4, textAlign: 'justify' }}>{p}</Text>
                ))}
            </View>

            {/* Skills */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Yetenekler</Text>
                <View style={styles.skillsContainer}>
                    {skills.map((skill, index) => (
                        <Text key={index} style={styles.skillTag}>{skill.name}</Text>
                    ))}
                </View>
            </View>

            {/* Experience */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Deneyim</Text>
                {experience.map((exp, index) => (
                    <View key={index} style={styles.item}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{exp.title}</Text>
                            <Text style={styles.itemDate}>{exp.date}</Text>
                        </View>
                        <Text style={styles.itemSubtitle}>{exp.company} - {exp.type}</Text>
                        <Text style={styles.description}>{exp.description}</Text>
                    </View>
                ))}
            </View>

            {/* Education */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Eğitim</Text>
                {education.map((edu, index) => (
                    <View key={index} style={styles.item}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{edu.degree}</Text>
                            <Text style={styles.itemDate}>{edu.date}</Text>
                        </View>
                        <Text style={styles.itemSubtitle}>{edu.school}</Text>
                        <Text style={styles.description}>{edu.description}</Text>
                    </View>
                ))}
            </View>

            {/* Certifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sertifikalar</Text>
                {certifications.map((cert, index) => (
                    <View key={index} style={[styles.item, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemTitle, { fontSize: 11 }]}>{cert.title}</Text>
                            <Text style={[styles.itemSubtitle, { fontSize: 9 }]}>{cert.organization}</Text>
                        </View>
                        <Text style={styles.itemDate}>{cert.date}</Text>
                    </View>
                ))}
            </View>

        </Page>
    </Document>
);
