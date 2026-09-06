import BehindScenesSection from "@/components/team/BehindScenesSection";
import JoinTeamSection from "@/components/team/JoinTeamSection";
import TeamCultureSection from "@/components/team/TeamCultureSection";
import TeamFAQSection from "@/components/team/TeamFAQSection";
import TeamFinalCTA from "@/components/team/TeamFinalCTA";
import TeamHero from "@/components/team/TeamHero";

export default function TeamPage() {
    return (
        <>
            <TeamHero />
            <TeamCultureSection />
            <BehindScenesSection />
            <JoinTeamSection />
            <TeamFAQSection />
            <TeamFinalCTA />
        </>
    )
}