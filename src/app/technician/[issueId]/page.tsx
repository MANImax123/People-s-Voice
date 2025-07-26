import UpdateIssuePanel from "@/components/update-issue-panel";

export default function UpdateIssuePage({ params }: { params: { issueId: string } }) {
    return <UpdateIssuePanel issueId={params.issueId} />;
}
