import prisma from "@/config/prisma";
import type { Relation, Relationship, SubjectType } from "@prisma/client";

const relationshipSelect = {
    id: true,
    subject: true,
    subjectType: true,
    relation: true,
    object: true,
    createdAt: true,
} as const;

type RelationshipRecord = Pick<
    Relationship,
    "id" | "subject" | "subjectType" | "relation" | "object" | "createdAt"
>;

type SubjectRelationQuery = {
    subject: string;
    relation: Relation;
    subjectType?: SubjectType;
};

type ObjectRelationQuery = {
    object: string;
    relation: Relation;
};

class RelationshipRepository {
    async findBySubjectRelation({ subject, relation, subjectType }: SubjectRelationQuery): Promise<RelationshipRecord[]> {
        return prisma.relationship.findMany({
            where: {
                subject,
                relation,
                ...(subjectType ? { subjectType } : {}),
            },
            select: relationshipSelect,
        });
    }

    async findByObjectRelation({ object, relation }: ObjectRelationQuery): Promise<RelationshipRecord[]> {
        return prisma.relationship.findMany({
            where: {
                object,
                relation,
            },
            select: relationshipSelect,
        });
    }

    async findFirstBySubjectRelation(subject: string, relation: Relation, object: string): Promise<RelationshipRecord | null> {
        return prisma.relationship.findFirst({
            where: {
                subject,
                relation,
                object,
            },
            select: relationshipSelect,
        });
    }
}

export const relationshipRepository = new RelationshipRepository();
export type { ObjectRelationQuery, RelationshipRecord, SubjectRelationQuery };

