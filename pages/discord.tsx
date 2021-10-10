export default function RedirectToDiscord() {
    return null;
}

export const getServerSideProps = async (): Promise<{
    redirect: {
        destination: string;
        permanent: boolean;
    };
}> => {
    return {
        redirect: {
            destination: "https://discord.gg/ESC45saAGP",
            permanent: true
        }
    }
};